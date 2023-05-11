const { query: Hasura } = require('../../../utils/hasura');
const { addIdea, addTags, addSkillsRequired, addRolesRequired } = require('./queries/mutations');
const { getUser, getIdea } = require('./queries/queries');
const createDefaultTeam = require('../../../utils/createDefaultTeam');
const cleanIdeaDoc = require('../../../utils/cleanIdeaDoc');
const catchAsync = require('../../../utils/catchAsync');

const addIdeas = catchAsync(async (req, res) => {
  const cognito_sub = req.body.cognito_sub;
  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  // If failed to find user return error
  if (!response1.success)
    res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find login user',
    });

  const allowed_statuses = ['ideation', 'mvp/prototype', 'traction'];

  let ideaData = {
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
    teamCreated = await createDefaultTeam(
      response1.result.data.user[0].id,
      req.body.team_name ? req.body.team_name : req.body.title + ' team',
      req.body.looking_for_mentors,
      req.body.looking_for_members
    );

    if (!teamCreated.success) {
      return res.json({ teamCreated });
    }

    ideaData.team_id = teamCreated.team_id;
  } else {
    ideaData.team_id = null;
  }

  const response2 = await Hasura(addIdea, ideaData);

  // If failed to insert idea return error
  if (!response2.success)
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
    });

  role_if: if (ideaData.team_id && req.body.roles_required.length > 0) {
    const roles_data = req.body.roles_required.map((ele) => {
      return {
        team_id: ideaData.team_id,
        role_name: ele.role_name,
      };
    });

    const response1 = await Hasura(addRolesRequired, { objects: roles_data });

    if (!response1.success) break role_if;

    let skills_data = [];

    for (const i in req.body.roles_required) {
      for (const skill of req.body.roles_required[i].skills_required) {
        skills_data.push({
          role_requirement_id: response1.result.data.insert_team_role_requirements.returning[i].id,
          skill_name: skill,
        });
      }
    }

    const response2 = await Hasura(addSkillsRequired, { objects: skills_data });
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
  }

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = addIdeas;
