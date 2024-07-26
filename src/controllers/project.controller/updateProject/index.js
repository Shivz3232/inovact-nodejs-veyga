const updateProject = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { id, cognito_sub } = req.body;

  const variables = {
    id: { _eq: id },
    changes: {},
  };

  const getUserIdFromCognitoResponse = await Hasura(getUserIdFromCognito, { cognito_sub });
  const { user_id } = getUserIdFromCognitoResponse.result.data.user[0];

  // Update basic project information
  ['description', 'title', 'link', 'status'].forEach((field) => {
    if (req.body[field] !== undefined) variables.changes[field] = req.body[field];
  });

  const response = await Hasura(updatePost, variables);
  let { team_id } = response.result.data.update_project.returning[0];

  // Check if major changes are being made
  const majorChanges =
    req.body.completed !== undefined ||
    req.body.looking_for_members !== undefined ||
    req.body.looking_for_mentors !== undefined ||
    (req.body.roles_required && req.body.roles_required.length > 0);

  // Handle project completion
  if (req.body.completed) {
    await handleProjectCompletion(team_id, id);
    return res.json({ success: true, errorCode: '', errorMessage: '' });
  }

  // Create or update team if necessary
  if (!team_id || majorChanges) {
    team_id = await handleTeamCreationOrUpdate(team_id, user_id, req.body);
  }

  // Update project flags if changed
  if (req.body.looking_for_members !== undefined || req.body.looking_for_mentors !== undefined) {
    await updateProjectFlags(team_id, req.body.looking_for_mentors, req.body.looking_for_members);
  }

  // Handle roles and skills
  if (majorChanges && req.body.roles_required && req.body.roles_required.length > 0) {
    await handleRolesAndSkills(team_id, req.body.roles_required);
  }

  // Update documents if provided
  if (req.body.documents && req.body.documents.length > 0) {
    await updateProjectDocuments(id, req.body.documents);
  }

  // Update project tags if provided
  if (req.body.project_tags && req.body.project_tags.length > 0) {
    await updateProjectTags(id, req.body.project_tags);
  }

  return res.json({ success: true, errorCode: '', errorMessage: '' });
});

// Helper functions

async function handleProjectCompletion(team_id, project_id) {
  await Hasura(updateProjectFlags, { team_id, lookingForMentors: false, lookingForMembers: false });
  const getTeamMembersResponse = await Hasura(getTeamMembers, { team_id });
  const teamMembers = getTeamMembersResponse.result.data.team_members;
  teamMembers.forEach((member) => {
    insertUserActivity('completion-of-project-as-team', 'positive', member.user_id, [project_id]);
  });
  await Hasura(deleteTeam, { team_id });
}

async function handleTeamCreationOrUpdate(team_id, user_id, body) {
  if (!team_id) {
    const teamName = body.team_name || `${body.title} team`;
    const teamCreated = await createDefaultTeam(
      user_id,
      teamName,
      body.looking_for_mentors,
      body.looking_for_members,
      body.team_on_inovact
    );
    team_id = teamCreated.team_id;
    await Hasura(UpdateProjectTeam, { projectId: body.id, newTeamId: team_id });
  }
  return team_id;
}

async function updateProjectFlags(team_id, lookingForMentors, lookingForMembers) {
  await Hasura(updateProjectFlags, { team_id, lookingForMentors, lookingForMembers });
}

async function handleRolesAndSkills(team_id, roles_required) {
  const roles_data = roles_required.map((ele) => ({ team_id, role_name: ele.role_name }));
  const response = await Hasura(addRolesRequired, { objects: roles_data });

  if (response.success) {
    const skills_data = roles_required.flatMap((role, index) =>
      role.skills_required.map((skill) => ({
        role_requirement_id: response.result.data.insert_team_role_requirements.returning[index].id,
        skill_name: skill,
      }))
    );
    await Hasura(addSkillsRequired, { objects: skills_data });
  }
}

async function updateProjectDocuments(project_id, documents) {
  const formattedDocuments = documents.map((document) => ({
    name: document.name,
    url: document.url,
    project_id,
  }));
  await Hasura(updateDocuments, { project_id, documents: formattedDocuments });
}

async function updateProjectTags(project_id, project_tags) {
  const tags = project_tags.map((tag_name) => ({
    hashtag: {
      data: { name: tag_name.toLowerCase() },
      on_conflict: { constraint: 'hashtag_tag_name_key', update_columns: 'name' },
    },
    project_id,
  }));
  await Hasura(updateProjectTags, { projectId: project_id, tags });
}

module.exports = updateProject;
