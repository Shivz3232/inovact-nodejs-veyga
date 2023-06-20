/* eslint-disable no-shadow */
/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const { query: Hasura } = require('../../../utils/hasura');
const { addIdea, addTags, addSkillsRequired, addRolesRequired } = require('./queries/mutations');
const { getUser } = require('./queries/queries');
const createDefaultTeam = require('../../../utils/createDefaultTeam');
const catchAsync = require('../../../utils/catchAsync');
const logger = require('../../../config/logger');

const addIdeas = catchAsync(async (req, res) => {
  // const { cognito_sub, title, description, link, status, team_id, looking_for_members, looking_for_mentors, team_name, roles_required, idea_tags } = req.body;

  const cognito_sub = typeof req.body.cognito_sub === 'string' && req.body.cognito_sub.trim().length != 0 ? req.body.cognito_sub.trim() : false;

  const title = typeof req.body.title === 'string' && req.body.title.trim().length != 0 ? req.body.title.trim() : false;
  const description = typeof req.body.description === 'string' && req.body.description.trim().length != 0 ? req.body.description.trim() : false;
  const link = typeof req.body.link === 'string' && req.body.link.trim().length != 0 ? req.body.link.trim() : false;
  const idea_tags = typeof req.body.idea_tags === 'string' && req.body.idea_tags.trim().length != 0 ? req.body.idea_tags.trim() : false;
  const status = typeof req.body.status === 'string' && req.body.status.trim().length != 0 ? req.body.status.trim() : false;

  const team_id = typeof req.body.team_id === 'string' && req.body.team_id.trim().length != 0 ? req.body.team_id.trim() : false;
  const team_name = typeof req.body.team_name === 'string' && req.body.team_name.trim().length != 0 ? req.body.team_name.trim() : false;
  const looking_for_members = typeof req.body.looking_for_members === 'string' && req.body.looking_for_members.trim().length != 0 ? req.body.looking_for_members.trim() : false;
  const looking_for_mentors = typeof req.body.looking_for_mentors === 'string' && req.body.looking_for_mentors.trim().length != 0 ? req.body.looking_for_mentors.trim() : false;
  const roles_required = typeof req.body.roles_required === 'string' && req.body.roles_required.trim().length != 0 ? req.body.roles_required.trim() : false;

  if (!cognito_sub) {
    res.status(500);
    return res.end('Unauthorized');
  }

  if (!title || !description || !link || !idea_tags || !status || !team_id || !team_name || !looking_for_members || !looking_for_mentors || !roles_required) {
    res.status(400);
    res.json('Invalid or missing required parameters');
    return res.end();
  }

  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  // If failed to find user return error
  if (!response1.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find login user',
    });

  const allowed_statuses = ['ideation', 'mvp/prototype', 'traction'];

  const ideaData = {
    description: req.body.description,
    title: req.body.title,
    user_id: response1.result.data.user[0].id,
    status: allowed_statuses.indexOf(req.body.status) > -1 ? req.body.status : 'ideation',
    link: req.body.link ? req.body.link : '',
  };

  let teamCreated;

  // Create a default team
  if (req.body.team_id) {
    ideaData.team_id = req.body.team_id;
  } else if (req.body.looking_for_members || req.body.looking_for_mentors) {
    teamCreated = await createDefaultTeam(response1.result.data.user[0].id, req.body.team_name ? req.body.team_name : `${req.body.title} team`, req.body.looking_for_mentors, req.body.looking_for_members);

    if (!teamCreated.success) {
      return res.json(teamCreated);
    }

    ideaData.team_id = teamCreated.team_id;
  } else {
    ideaData.team_id = null;
  }

  const response2 = await Hasura(addIdea, ideaData);

  // If failed to insert idea return error
  if (!response2.success) {
    logger.error(response2.errors);
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
    });
  }

  role_if: if (ideaData.team_id && req.body.roles_required.length > 0) {
    const roles_data = req.body.roles_required.map((ele) => {
      return {
        team_id: ideaData.team_id,
        role_name: ele.role_name,
      };
    });

    const response1 = await Hasura(addRolesRequired, { objects: roles_data });

    if (!response1.success) break role_if;

    const skills_data = [];

    for (const i in req.body.roles_required) {
      for (const skill of req.body.roles_required[i].skills_required) {
        skills_data.push({
          role_requirement_id: response1.result.data.insert_team_role_requirements.returning[i].id,
          skill_name: skill,
        });
      }
    }

    const response2 = await Hasura(addSkillsRequired, { objects: skills_data });

    if (!response2.success) {
      logger.error(response2.errors);
    }
  }

  // Insert tags
  if (req.body.idea_tags.length) {
    const tags = req.body.idea_tags.map((tag_name) => {
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

    if (!response3.success) {
      logger.error(response3.errors);
    }
  }

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = addIdeas;
