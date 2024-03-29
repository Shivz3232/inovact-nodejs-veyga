/* eslint-disable prefer-destructuring */
const { validationResult } = require('express-validator');
const logger = require('../../../config/logger.js');
const addPostComment = require('./helpers/addPostComment.js');
const addIdeaComment = require('./helpers/addIdeaComment.js');
const addThoughtComment = require('./helpers/addThoughtComment.js');
const { getUserId } = require('./queries/queries.js');
const notify = require('../../../utils/notify.js');
const { query: Hasura } = require('../../../utils/hasura.js');
const catchAsync = require('../../../utils/catchAsync.js');

const addComment = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { text, cognito_sub, article_id } = req.body;
  let { article_type } = req.body;

  // Find user id
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  let response;
  let entity_type_id;
  let doc;
  let notifier_id;

  if (article_type === 'post') {
    article_type = 'project';
    entity_type_id = 2;
    response = await addPostComment(text, response1.result.data.user[0].id, article_id);
    doc = response.result.data.insert_project_comment.returning[0];
    notifier_id = doc.project.user_id;
  } else if (article_type === 'idea') {
    entity_type_id = 7;
    response = await addIdeaComment(text, response1.result.data.user[0].id, article_id);
    doc = response.result.data.insert_idea_comment.returning[0];
    notifier_id = doc.idea.user_id;
  } else if (article_type === 'thought') {
    article_type = 'thoughts';
    entity_type_id = 12;
    response = await addThoughtComment(text, response1.result.data.user[0].id, article_id);
    doc = response.result.data.insert_thought_comments.returning[0];
    notifier_id = doc.thought.user_id;
  } else {
    return res.status(400).json({
      success: false,
      errorCode: 'INVALID_ARTICLE_TYPE',
      errorMessage: 'Invalid article type provided',
      data: null,
    });
  }

  // Notify the user
  await notify(entity_type_id, doc.id, response1.result.data.user[0].id, [notifier_id]).catch(logger.error);

  if (article_type === 'project') {
    return res.status(200).json({
      success: true,
      errorCode: '',
      errorMessage: '',
      data: {
        user_id: doc.user_id,
        text: doc.text,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        id: doc.project_id,
      },
    });
  }
  if (article_type === 'idea') {
    return res.status(200).json({
      success: true,
      errorCode: '',
      errorMessage: '',
      data: {
        id: doc.idea_id,
        user_id: doc.user_id,
        text: doc.text,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
      },
    });
  }
  return res.status(200).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: {
      user_id: doc.user_id,
      text: doc.text,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      id: doc.thought_id,
    },
  });
});

module.exports = addComment;
