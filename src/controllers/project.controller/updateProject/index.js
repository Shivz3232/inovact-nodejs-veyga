const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const {
  updatePost,
  updateProjectFlags,
  updateDocuments,
  UpdateProjectTeam,
  updateProjectTags,
  deleteTeam,
  updateLookingForTeamMembersAndMentors,
} = require('./queries/mutations');
const { getTeamMembers } = require('./queries/queries');
const createDefaultTeam = require('../../../utils/createDefaultTeam');
const insertUserActivity = require('../../../utils/insertUserActivity');
const handleRoleAndSkillUpdates = require('../../../utils/updateRolesAndSkillForPost');

const updateProject = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  try {
    const { id, cognito_sub } = req.body;

    // Prepare project update variables
    const variables = {
      cognito_sub,
      id,
      changes: {},
    };

    // Set project fields if provided
    if (req.body.description) variables.changes.description = req.body.description;
    if (req.body.title) variables.changes.title = req.body.title;
    if (req.body.link) variables.changes.link = req.body.link;
    if (req.body.status !== undefined) variables.changes.status = req.body.status;
    if (req.body.completed !== undefined) variables.changes.completed = req.body.completed;
    if (req.body.github_repo_url !== undefined)
      variables.changes.github_repo_url = req.body.github_repo_url;

    // Update project and get current state
    const response = await Hasura(updatePost, variables);

    if (response.result.data.update_project.returning.length === 0) {
      return res.status(404).json({
        success: false,
        errorCode: 'ProjectNotFound',
        errorMessage: 'Project not found',
      });
    }

    const { user_id, team_id: currentTeamId } = response.result.data.update_project.returning[0];

    let teamId = currentTeamId;

    // Handle project completion
    if (req.body.completed && teamId) {
      const projectFlagsUpdateVariables = {
        teamId,
        lookingForMentors: false,
        lookingForMembers: false,
      };
      await Hasura(updateProjectFlags, projectFlagsUpdateVariables);

      const getTeamMembersResponse = await Hasura(getTeamMembers, {
        teamId,
      });

      const teamMembers = getTeamMembersResponse.result.data.team_members;

      // Insert activity for all team members
      teamMembers.forEach((teamMember) => {
        insertUserActivity('completion-of-project-as-team', 'positive', teamMember.user_id, [id]);
      });

      return res.json({
        success: true,
        errorCode: '',
        errorMessage: '',
      });
    }

    // Handle team updates
    if (
      teamId &&
      ((response.result.data.update_project.returning[0].team.looking_for_mentors === true &&
        req.body.looking_for_mentors === false) ||
        (response.result.data.update_project.returning[0].team.looking_for_members === true &&
          req.body.looking_for_members === false))
    ) {
      if (!req.body.looking_for_mentors && !req.body.looking_for_members) {
        await Hasura(deleteTeam, { teamId });
        teamId = null;
      } else {
        await Hasura(updateLookingForTeamMembersAndMentors, {
          teamId,
          looking_for_members: req.body.looking_for_members,
          looking_for_mentors: req.body.looking_for_mentors,
        });
      }
    }

    // Create new team if needed
    if (!teamId && (req.body.looking_for_mentors || req.body.looking_for_members)) {
      if (!req.body.roles_required || req.body.roles_required.length === 0) {
        return res.status(400).json({
          success: false,
          errorCode: 'InvalidInput',
          errorMessage: 'Roles required must be provided when creating a team',
        });
      }

      const teamName = req.body.team_name ? req.body.team_name : `${req.body.title} team`;
      const teamCreated = await createDefaultTeam(
        user_id,
        teamName,
        req.body.looking_for_mentors,
        req.body.looking_for_members,
        req.body.team_on_inovact
      );
      teamId = teamCreated.team_id;

      // Update project with new team
      await Hasura(UpdateProjectTeam, {
        projectId: id,
        newTeamId: teamId,
      });
    }

    // Handle roles and skills
    if (req.body.roles_required && req.body.roles_required.length > 0 && teamId) {
      await handleRoleAndSkillUpdates(teamId, req.body.roles_required, Hasura);
    }

    // Update documents if provided
    if (req.body.documents && req.body.documents.length > 0) {
      const documents = req.body.documents.map((document) => ({
        name: document.name,
        url: document.url,
        project_id: id,
      }));
      await Hasura(updateDocuments, { project_id: id, documents });
    }

    // Update tags if provided
    if (req.body.project_tags && req.body.project_tags.length > 0) {
      const tags = req.body.project_tags.map((tag_name) => ({
        hashtag: {
          data: {
            name: tag_name.toLowerCase(),
          },
          on_conflict: {
            constraint: 'hashtag_tag_name_key',
            update_columns: 'name',
          },
        },
        project_id: id,
      }));

      await Hasura(updateProjectTags, {
        projectId: id,
        tags,
      });
    }

    return res.json({
      success: true,
      errorCode: '',
      errorMessage: '',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorCode: 'UpdateFailed',
      errorMessage: 'Failed to update project. Please try again.',
    });
  }
});

module.exports = updateProject;
