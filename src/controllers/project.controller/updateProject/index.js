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
const { getUserIdFromCognito, getTeamMembers } = require('./queries/queries');
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

    // Get user ID from cognito_sub
    const getUserIdFromCognitoResponse = await Hasura(getUserIdFromCognito, {
      cognito_sub,
    });

    if (
      !getUserIdFromCognitoResponse.result.data.user ||
      !getUserIdFromCognitoResponse.result.data.user[0]
    ) {
      return res.status(404).json({
        success: false,
        errorCode: 'UserNotFound',
        errorMessage: 'User not found',
      });
    }

    const currentUserId = getUserIdFromCognitoResponse.result.data.user[0].id;

    // Prepare project update variables
    const variables = {
      id: { _eq: id },
      changes: {},
    };

    // Set project fields if provided
    if (req.body.description) variables.changes.description = req.body.description;
    if (req.body.title) variables.changes.title = req.body.title;
    if (req.body.link) variables.changes.link = req.body.link;
    if (req.body.status !== undefined) variables.changes.status = req.body.status;
    if (req.body.completed !== undefined) variables.changes.completed = req.body.completed;

    // Update project and get current state
    const response = await Hasura(updatePost, variables);

    if (!response.result.data.update_project.returning[0]) {
      return res.status(404).json({
        success: false,
        errorCode: 'ProjectNotFound',
        errorMessage: 'Project not found',
      });
    }

    const { user_id, team_id: currentTeamId } = response.result.data.update_project.returning[0];

    console.log('currentTeamId: ', currentTeamId);

    // Check user permission
    if (user_id !== currentUserId) {
      return res.status(403).json({
        success: false,
        errorCode: 'Forbidden',
        errorMessage: 'You do not have permission to update this project',
      });
    }

    let team_id = currentTeamId;

    // Handle project completion
    if (req.body.completed && currentTeamId) {
      const projectFlagsUpdateVariables = {
        team_id: currentTeamId,
        lookingForMentors: false,
        lookingForMembers: false,
      };
      await Hasura(updateProjectFlags, projectFlagsUpdateVariables);

      const getTeamMembersResponse = await Hasura(getTeamMembers, {
        team_id: currentTeamId,
      });

      const teamMembers = getTeamMembersResponse.result.data.team_members;

      // Insert activity for all team members
      for (const member of teamMembers) {
        await insertUserActivity('completion-of-project-as-team', 'positive', member.user_id, [id]);
      }

      return res.json({
        success: true,
        errorCode: '',
        errorMessage: '',
      });
    }

    // Handle team updates
    if (
      currentTeamId &&
      ((response.result.data.update_project.returning[0].team.looking_for_mentors === true &&
        req.body.looking_for_mentors === false) ||
        (response.result.data.update_project.returning[0].team.looking_for_members === true &&
          req.body.looking_for_members === false))
    ) {
      if (!req.body.looking_for_mentors && !req.body.looking_for_members) {
        await Hasura(deleteTeam, { team_id: currentTeamId });
        team_id = null;
      } else {
        await Hasura(updateLookingForTeamMembersAndMentors, {
          teamId: currentTeamId,
          looking_for_members: req.body.looking_for_members,
          looking_for_mentors: req.body.looking_for_mentors,
        });
      }
    }

    // Create new team if needed
    if (!currentTeamId && (req.body.looking_for_mentors || req.body.looking_for_members)) {
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
      team_id = teamCreated.team_id;

      // Update project with new team
      await Hasura(UpdateProjectTeam, {
        projectId: id,
        newTeamId: team_id,
      });

      currentTeamId = team_id;
    }

    // Handle roles and skills
    if (req.body.roles_required && req.body.roles_required.length > 0 && currentTeamId) {
      const roleUpdateResult = await handleRoleAndSkillUpdates(
        currentTeamId,
        req.body.roles_required,
        Hasura
      );
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
        tags: tags,
      });
    }

    return res.json({
      success: true,
      errorCode: '',
      errorMessage: '',
    });
  } catch (error) {
    console.error('Project update error:', error);
    return res.status(500).json({
      success: false,
      errorCode: 'UpdateFailed',
      errorMessage: 'Failed to update project. Please try again.',
    });
  }
});

module.exports = updateProject;
