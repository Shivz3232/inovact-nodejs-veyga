const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const {
  updateIdea,
  updateRolesRequired,
  addRolesRequired,
  addSkillsRequired,
  updateIdeaFlags,
  UpdateIdeaTeam,
  updateIdeaTags,
  deleteTeam,
  updateLookingForTeamMembersAndMentors,
} = require('./queries/mutations');
const { getUserIdFromCognito, getTeamMembers } = require('./queries/queries');
const createDefaultTeam = require('../../../utils/createDefaultTeam');
const insertUserActivity = require('../../../utils/insertUserActivity');

const updateIdeas = catchAsync(async (req, res) => {
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

    // Prepare idea update variables
    const variables = {
      id: { _eq: id },
      changes: {},
    };

    // Set idea fields if provided
    if (req.body.description) variables.changes.description = req.body.description;
    if (req.body.title) variables.changes.title = req.body.title;
    if (req.body.link) variables.changes.link = req.body.link;
    if (req.body.status) {
      const allowed_statuses = ['ideation', 'mvp', 'prototype', 'scaling'];
      variables.changes.status = allowed_statuses.includes(req.body.status)
        ? req.body.status
        : 'ideation';
    }

    // Update idea and get current state
    const response = await Hasura(updateIdea, variables);

    if (!response.result.data.update_idea.returning[0]) {
      return res.status(404).json({
        success: false,
        errorCode: 'IdeaNotFound',
        errorMessage: 'Idea not found',
      });
    }

    const { user_id, team_id: currentTeamId } = response.result.data.update_idea.returning[0];

    // Check user permission
    if (user_id !== currentUserId) {
      return res.status(403).json({
        success: false,
        errorCode: 'Forbidden',
        errorMessage: 'You do not have permission to update this idea',
      });
    }

    let team_id = currentTeamId;

    // Handle team updates
    if (
      currentTeamId &&
      ((response.result.data.update_idea.returning[0].team.looking_for_mentors === true &&
        req.body.looking_for_mentors === false) ||
        (response.result.data.update_idea.returning[0].team.looking_for_members === true &&
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
        req.body.looking_for_members
      );
      team_id = teamCreated.team_id;

      // Update idea with new team
      await Hasura(UpdateIdeaTeam, {
        ideaId: id,
        newTeamId: team_id,
      });

      // Handle roles and skills
      if (req.body.roles_required && req.body.roles_required.length > 0) {
        const roles_data = req.body.roles_required.map((ele) => ({
          team_id,
          role_name: ele.role_name,
        }));

        const rolesResponse = await Hasura(addRolesRequired, { objects: roles_data });

        if (rolesResponse.success) {
          const skills_data = [];

          for (let i = 0; i < req.body.roles_required.length; i++) {
            const role = req.body.roles_required[i];
            if (role.skills_required) {
              for (const skill of role.skills_required) {
                skills_data.push({
                  role_requirement_id:
                    rolesResponse.result.data.insert_team_role_requirements.returning[i].id,
                  skill_name: skill,
                });
              }
            }
          }

          if (skills_data.length > 0) {
            await Hasura(addSkillsRequired, { objects: skills_data });
          }
        }
      }
    }

    // Update tags if provided
    if (req.body.idea_tags && req.body.idea_tags.length > 0) {
      const tags = req.body.idea_tags.map((tag_name) => ({
        hashtag: {
          data: {
            name: tag_name.toLowerCase(),
          },
          on_conflict: {
            constraint: 'hashtag_tag_name_key',
            update_columns: 'name',
          },
        },
        idea_id: id,
      }));

      await Hasura(updateIdeaTags, {
        ideaId: id,
        tags: tags,
      });
    }

    return res.json({
      success: true,
      errorCode: '',
      errorMessage: '',
    });
  } catch (error) {
    console.error('Idea update error:', error);
    return res.status(500).json({
      success: false,
      errorCode: 'UpdateFailed',
      errorMessage: 'Failed to update idea. Please try again.',
    });
  }
});

module.exports = updateIdeas;
