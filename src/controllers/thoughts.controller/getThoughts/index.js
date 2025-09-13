const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const cleanThoughtDoc = require('../../../utils/cleanThoughtDoc');
const { query: Hasura } = require('../../../utils/hasura');
const { getThought, getThoughts: getThoughtsQuery, getConnections } = require('./queries/queries');
const recommender = require('./recommender');
const {
  validatePaginationParams,
  createPaginationMeta,
  createPaginatedResponse,
  createEmptyPaginatedResponse,
} = require('../../../utils/pagination');

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

  // Get pagination parameters (only if not fetching single thought)
  const paginationParams = !id ? validatePaginationParams(req.query) : null;

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
      limit: paginationParams.limit,
      offset: paginationParams.offset,
    };

    queries = getThoughtsQuery;
  }

  variables.blocked_user_ids = blockedUserIds;
  const response1 = await Hasura(queries, variables);

  if (response1.result.data.thoughts.length === 0 && !id) {
    return res
      .status(200)
      .json(createEmptyPaginatedResponse(paginationParams.page, paginationParams.limit));
  }

  if (response1.result.data.thoughts.length === 0 && id) {
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

  // Get total count for pagination metadata
  const totalCount = response1.result.data.thoughts_aggregate?.aggregate?.count || 0;
  const paginationMeta = createPaginationMeta(
    paginationParams.page,
    paginationParams.limit,
    totalCount,
    cleanedThoughts
  );

  // const recommendedProjects = await recommender.recommend(cognito_sub, cleanedThoughts);

  return res.json(createPaginatedResponse(cleanedThoughts, paginationMeta));
});

module.exports = getThoughts;
