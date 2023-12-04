/* eslint-disable no-shadow */
/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
const { validationResult } = require('express-validator');
const { addProject: addProjectQuery, addMentions, addTags, insertProjectDocument, addRolesRequired, addSkillsRequired } = require('./queries/mutations');
const { getUser } = require('./queries/queries');
const { query: Hasura } = require('../../../utils/hasura');
const catchAsync = require('../../../utils/catchAsync');
const createDefaultTeam = require('../../../utils/createDefaultTeam');
const uploadToS3 = require('../../../utils/uploadToS3');

const addProject = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub, description, title, status, completed, link, looking_for_members, looking_for_mentors, roles_required, mentions, project_tags } = req.body;

  // Find user id
  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  // Insert project
  const projectData = {
    description,
    title,
    user_id: response1.result.data.user[0].id,
    status,
    completed,
    link,
  };

  let teamCreated;

  // Create a default team

  if (looking_for_members || looking_for_mentors) {
    teamCreated = await createDefaultTeam(response1.result.data.user[0].id, req.body.team_name ? req.body.team_name : `${req.body.title} team`, req.body.looking_for_mentors, req.body.looking_for_members, req.body.team_on_inovact);
    projectData.team_id = teamCreated.team_id;
  } else {
    projectData.team_id = null;
  }

  const response2 = await Hasura(addProjectQuery, projectData);

  // Insert roles required and skills required
  role_if: if (roles_required.length > 0 && projectData.team_id) {
    const roles_data = roles_required.map((ele) => {
      return {
        team_id: projectData.team_id,
        role_name: ele.role_name,
      };
    });

    const response1 = await Hasura(addRolesRequired, { objects: roles_data });

    if (!response1.success) break role_if;

    const skills_data = [];

    for (const i in roles_required) {
      // eslint-disable-next-line no-prototype-builtins
      if (roles_required.hasOwnProperty(i)) {
        for (const skill of roles_required[i].skills_required) {
          skills_data.push({
            role_requirement_id: response1.result.data.insert_team_role_requirements.returning[i].id,
            skill_name: skill,
          });
        }
      }
    }

    await Hasura(addSkillsRequired, { objects: skills_data });
  }

  // Insert mentions
  if (mentions) {
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
    await Hasura(addMentions, mentionsData);
  }

  // Insert tags
  if (project_tags.length) {
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
    await Hasura(addTags, tagsData);
  }

  // Insert Documents
  if (req.file) {
    const project_id = response2.result.data.insert_project.returning[0].id;
    const key = `${config.env}/project-documents/${project_id}/${req.file.originalname}`;
    const data = req.file.buffer;

    await uploadToS3(key, data);

    const documentData = {
      name: req.file.originalname,
      url: key,
      project_id,
    };

    // @TODO Fallback if documents fail to be inserted
    await Hasura(insertProjectDocument, documentData);
  }

  return res.status(201).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = addProject;
