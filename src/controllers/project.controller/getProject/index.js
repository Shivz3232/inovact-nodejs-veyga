const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { getProjects, getProject: getProjectQuery, getConnections } = require('./queries/queries');
const cleanPostDoc = require('../../../utils/cleanPostDoc');
const catchAsync = require('../../../utils/catchAsync');
const {
  validatePaginationParams,
  createPaginationMeta,
  createPaginatedResponse,
  createEmptyPaginatedResponse,
} = require('../../../utils/pagination');

const getProject = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;
  const { id } = req.query;

  // Get pagination parameters (only if not fetching single project)
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
    if (doc.user1 === userId) {
      connections[doc.user2] = doc.status;
    } else {
      connections[doc.user1] = doc.status;
    }
  });

  // Fetch blocked users
  const blockedUserIds = response.result.data.user_blocked_users.map(
    (blockedUser) => blockedUser.blocked_user_id
  );

  let queries;
  let variables;

  if (id) {
    variables = {
      id,
      cognito_sub,
    };
    queries = getProjectQuery;
  } else {
    variables = {
      cognito_sub,
      limit: paginationParams.limit,
      offset: paginationParams.offset,
    };
    queries = getProjects;
  }

  variables.blocked_user_ids = blockedUserIds;

  const response1 = await Hasura(queries, variables);

  if (response1.result.data.project.length === 0 && !id) {
    return res
      .status(200)
      .json(createEmptyPaginatedResponse(paginationParams.page, paginationParams.limit));
  }

  if (response1.result.data.project.length === 0 && id) {
    return res.status(400).json({
      success: false,
      errorCode: 'NotFound',
      errorMessage: 'Project not found',
      data: null,
    });
  }

  const cleanedPosts = response1.result.data.project
    .filter((doc) => !blockedUserIds.includes(doc.user.id))
    .map((doc) => {
      doc = cleanPostDoc(doc);
      doc.connections_status = connections[doc.user.id]
        ? connections[doc.user.id]
        : 'not connected';
      return doc;
    });

  if (id) return res.json(cleanedPosts[0]);

  // Get total count for pagination metadata
  const totalCount = response1.result.data.project_aggregate?.aggregate?.count || 0;
  const paginationMeta = createPaginationMeta(
    paginationParams.page,
    paginationParams.limit,
    totalCount,
    cleanedPosts
  );

  return res.json(createPaginatedResponse(cleanedPosts, paginationMeta));
});

module.exports = getProject;
