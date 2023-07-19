/* eslint-disable no-shadow */
/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const { query: Hasura } = require('../../../utils/hasura');
const { addIdea, addTags, addSkillsRequired, addRolesRequired } = require('./queries/mutations');
const { getUser } = require('./queries/queries');
const createDefaultTeam = require('../../../utils/createDefaultTeam');
const catchAsync = require('../../../utils/catchAsync');
const { validationResult } = require('express-validator');

const addIdeas = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }
  const { cognito_sub, description, title, status, link, looking_for_members, looking_for_mentors, roles_required, idea_tags } = req.body;
  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  const allowed_statuses = ['ideation', 'mvp/prototype', 'traction'];

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
    teamCreated = await createDefaultTeam(response1.result.data.user[0].id, req.body.team_name ? req.body.team_name : `${req.body.title} team`, req.body.looking_for_mentors, req.body.looking_for_members);

    ideaData.team_id = teamCreated.team_id;
  } else {
    ideaData.team_id = null;
  }

  const response2 = await Hasura(addIdea, ideaData);

  role_if: if (ideaData.team_id && roles_required.length > 0) {
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

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = addIdeas;
