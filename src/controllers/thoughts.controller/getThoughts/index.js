const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const cleanThoughtDoc = require('../../../utils/cleanThoughtDoc');
const { query: Hasura } = require('../../../utils/hasura');
const { getThought, getThoughts: getThoughtsQuery, getConnections } = require('./queries/queries');
const recommender = require('./recommender');

const getThoughts = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;
  const { id } = req.query;

  const response = await Hasura(getConnections, { cognito_sub });
  if (response.result.data.user.length === 0) {
    return res.status(401).json({
      success: false,
      errorCode: 'NotFound',
      errorMessage: 'User not found in the database',
      data: null,
    });
  }

  const userId = response.result.data.user[0].id;

  const connections = {};
  response.result.data.connections.forEach((doc) => {
    connections[doc.user1] = doc.status;

    if (doc.user1 === userId) {
      connections[doc.user2] = doc.status;
    }
  });

  const blockedUserIds = response.result.data.user_blocked_users.map(
    (blockedUser) => blockedUser.blocked_user_id
  );

  let variables;
  let queries;

  if (id) {
    variables = {
      id,
      cognito_sub,
    };
    queries = getThought;
  } else {
    variables = {
      cognito_sub,
    };

    queries = getThoughtsQuery;
  }

  variables.blocked_user_ids = blockedUserIds;
  const response1 = await Hasura(queries, variables);

  if (response1.result.data.thoughts.length === 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'NotFound',
      errorMessage: 'Thought not found',
      data: null,
    });
  }

  const cleanedThoughts = response1.result.data.thoughts.map((doc) => {
    doc = cleanThoughtDoc(doc);
    doc.connections_status = connections[doc.user.id] ? connections[doc.user.id] : 'not connected';
    return doc;
  });

  if (id) return res.json(cleanedThoughts[0]);

  const recommendedProjects = await recommender.recommend(cognito_sub, cleanedThoughts);

  // TODO: Pagination

  return res.json(recommendedProjects);
});

module.exports = getThoughts;
