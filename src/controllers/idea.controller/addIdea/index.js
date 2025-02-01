/* eslint-disable no-shadow */
/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const {
  addIdea,
  addTags,
  addSkillsRequired,
  addRolesRequired,
  updateUserFlags,
} = require('./queries/mutations');
const { getUser, getMyConnections } = require('./queries/queries');
const enqueueEmailNotification = require('../../../utils/enqueueEmailNotification');
const cleanConnections = require('../../../utils/cleanConnections');
const createDefaultTeam = require('../../../utils/createDefaultTeam');
const catchAsync = require('../../../utils/catchAsync');
const insertUserActivity = require('../../../utils/insertUserActivity');
const notify = require('../../../utils/notify');

const addIdeas = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }
  const {
    cognito_sub,
    description,
    title,
    status,
    link,
    looking_for_members,
    looking_for_mentors,
    roles_required,
    idea_tags,
  } = req.body;

  if (looking_for_members && roles_required.length === 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'InvalidInput',
      errorMessage: "Roles required can't be empty when looking for members",
    });
  }

  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  const userEventFlags = response1.result.data.user[0].user_action;

  const allowed_statuses = ['ideation', 'mvp', 'prototype', 'scaling'];

  const ideaData = {
    description,
    title,
    user_id: response1.result.data.user[0].id,
    status: allowed_statuses.indexOf(status) > -1 ? req.body.status : 'ideation',
    link,
  };

  let teamCreated;

  // Create a default team
  if (looking_for_members || looking_for_mentors) {
    teamCreated = await createDefaultTeam(
      response1.result.data.user[0].id,
      req.body.team_name ? req.body.team_name : `${req.body.title} team`,
      req.body.looking_for_mentors,
      req.body.looking_for_members
    );
    ideaData.team_id = teamCreated.team_id;
  } else {
    ideaData.team_id = null;
  }

  const response2 = await Hasura(addIdea, ideaData);

  if (ideaData.team_id && roles_required.length > 0) {
    const roles_data = roles_required.map((ele) => {
      return {
        team_id: ideaData.team_id,
        role_name: ele.role_name,
      };
    });

    const response1 = await Hasura(addRolesRequired, { objects: roles_data });

    const skills_data = [];

    for (const i in roles_required) {
      for (const skill of roles_required[i].skills_required) {
        skills_data.push({
          role_requirement_id: response1.result.data.insert_team_role_requirements.returning[i].id,
          skill_name: skill,
        });
      }
    }

    const response2 = await Hasura(addSkillsRequired, { objects: skills_data });
  }

  // Insert tags
  if (idea_tags.length) {
    const tags = idea_tags.map((tag_name) => {
      return {
        hashtag: {
          data: {
            name: tag_name.toLowerCase(),
          },
          on_conflict: {
            constraint: 'hashtag_tag_name_key',
            update_columns: 'name',
          },
        },
        idea_id: response2.result.data.insert_idea.returning[0].id,
      };
    });

    const tagsData = {
      objects: tags,
    };

    // @TODO Fallback if tags fail to be inserted
    const response3 = await Hasura(addTags, tagsData);
  }

  if (looking_for_members) {
    insertUserActivity('looking-for-team-member', 'positive', response1.result.data.user[0].id, [
      ideaData.team_id,
    ]);
  }
  if (looking_for_mentors) {
    insertUserActivity('looking-for-team-mentor', 'positive', response1.result.data.user[0].id, [
      response2.result.data.insert_idea.returning[0].id,
    ]);
  }

  // Send email notification
  const { id: actorId } = response1.result.data.user[0];
  const { id: ideaId } = response2.result.data.insert_idea.returning[0];
  const { team_id: teamId } = ideaData;

  // get connection usernids
  const getConnectionsResponse = await Hasura(getMyConnections, {
    cognito_sub,
  });
  const userConnectionIds = cleanConnections(
    getConnectionsResponse.result.data.connections,
    actorId
  );

  if (teamId) {
    // Explain things that can be done next to the user who uploaded the idea.
    enqueueEmailNotification(8, ideaId, actorId, [actorId]);
  }

  if (userConnectionIds.length > 0) {
    // Send email And notification to all connections that user has uploaded an idea
    enqueueEmailNotification(7, ideaId, actorId, userConnectionIds);
    notify(8, ideaId, actorId, userConnectionIds);
  }

  // Explain things that can be done next to the user who uploaded the idea.s
  enqueueEmailNotification(6, ideaId, actorId, [actorId]);

  insertUserActivity('uploading-idea', 'positive', actorId, [ideaId]);

  const needsIdeaUploadFlag = !userEventFlags.has_uploaded_idea;
  const needsTeamFlag =
    userEventFlags.has_sought_team || userEventFlags.has_sought_team === looking_for_members;
  const needsMentorFlag =
    userEventFlags.has_sought_mentor || userEventFlags.has_sought_mentor === looking_for_mentors;
  const needsTeamAndMentorFlag = !userEventFlags.has_sought_team_and_mentor;

  if (needsIdeaUploadFlag || (needsTeamFlag && needsMentorFlag) || needsTeamAndMentorFlag) {
    userEventFlags.has_uploaded_idea = true;
    userEventFlags.has_sought_team = userEventFlags.has_sought_team || looking_for_members;
    userEventFlags.has_sought_mentor = userEventFlags.has_sought_mentor || looking_for_mentors;
    userEventFlags.has_sought_team_and_mentor =
      userEventFlags.has_sought_team_and_mentor || (looking_for_members && looking_for_mentors);

    await Hasura(updateUserFlags, {
      userId: actorId,
      userEventFlags,
    });
  }

  return res.status(201).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = addIdeas;
