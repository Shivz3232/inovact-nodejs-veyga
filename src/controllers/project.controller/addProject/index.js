const { addProject: addProjectQuery, addMentions, addTags, addDocuments, addRolesRequired, addSkillsRequired } = require('./queries/mutations');
const { getUser, getProject } = require('./queries/queries');
const { query: Hasura } = require('../../../utils/hasura');
const catchAsync = require('../../../utils/catchAsync');
const createDefaultTeam = require('../../../utils/createDefaultTeam');
const logger = require('../../../config/logger');

const addProject = catchAsync(async (req, res) => {
  // Find user id
  const cognito_sub = req.body.cognito_sub;
  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  // If failed to find user return error
  if (!response1.success) {
    logger.error(JSON.stringify(response1.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find login user',
      data: null,
    });
  }

  // Insert project
  const projectData = {
    description: req.body.description,
    title: req.body.title,
    user_id: response1.result.data.user[0].id,
    status: req.body.status,
    completed: req.body.completed,
    link: req.body.link,
  };

  let teamCreated;

  // Create a default team
  if (req.body.team_id) {
    projectData.team_id = req.body.team_id;
  } else if (req.body.looking_for_members || req.body.looking_for_mentors) {
    teamCreated = await createDefaultTeam(response1.result.data.user[0].id, req.body.team_name ? req.body.team_name : req.body.title + ' team', req.body.looking_for_mentors, req.body.looking_for_members, req.body.team_on_inovact);

    if (!teamCreated.success) {
      logger.error(JSON.stringify(teamCreated.errors));

      return res.json(teamCreated.errors);
    }

    projectData.team_id = teamCreated.team_id;
  } else {
    projectData.team_id = null;
  }

  const response2 = await Hasura(addProjectQuery, projectData);

  // If failed to insert project return error
  if (!response2.success) {
    logger.error(JSON.stringify(response2.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    });
  }

  // Insert roles required and skills required
  role_if: if (req.body.roles_required.length > 0 && projectData.team_id) {
    const roles_data = req.body.roles_required.map((ele) => {
      return {
        team_id: projectData.team_id,
        role_name: ele.role_name,
      };
    });

    const response1 = await Hasura(addRolesRequired, { objects: roles_data });

    if (!response1.success) {
      logger.error(JSON.stringify(response1.errors));

      break role_if;
    }

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

    if (!response2.success) {
      logger.error(JSON.stringify(response2.errors));

      return res.json({
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response2.errors),
        data: null,
      });
    }
  }

  // Insert mentions
  if (req.body.mentions.length) {
    const mentions = req.body.mentions.map((user_id) => {
      return {
        user_id,
        project_id: response2.result.data.insert_project.returning[0].id,
      };
    });

    const mentionsData = {
      objects: mentions,
    };

    // @TODO Fallback if mentions fail to be inserted
    const response3 = await Hasura(addMentions, mentionsData);

    if (!response3.success) {
      logger.error(JSON.stringify(response3.errors));

      return res.json({
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response3.errors),
        data: null,
      });
    }
  }

  // Insert tags
  if (req.body.project_tags.length) {
    const tags = req.body.project_tags.map((tag_name) => {
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
        project_id: response2.result.data.insert_project.returning[0].id,
      };
    });

    const tagsData = {
      objects: tags,
    };

    // @TODO Fallback if tags fail to be inserted
    const response4 = await Hasura(addTags, tagsData);
    if (!response4.success) {
      logger.error(JSON.stringify(response4.errors));

      return res.json({
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response4.errors),
        data: null,
      });
    }
  }

  // Insert Documents
  if (req.body.documents.length) {
    const documents = req.body.documents.map((document) => {
      return res.json({
        name: document.name,
        url: document.url,
        project_id: response2.result.data.insert_project.returning[0].id,
      });
    });

    const documentsData = {
      objects: documents,
    };

    // @TODO Fallback if documents fail to be inserted
    const response6 = await Hasura(addDocuments, documentsData);
    if (!response6.success) {
      logger.error(JSON.stringify(response6.errors));

      return res.json({
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response6.errors),
        data: null,
      });
    }
  }

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = addProject;
