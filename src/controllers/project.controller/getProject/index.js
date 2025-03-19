const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { getProjects, getProject: getProjectQuery, getConnections } = require('./queries/queries');
const cleanPostDoc = require('../../../utils/cleanPostDoc');
const catchAsync = require('../../../utils/catchAsync');

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
    };
    queries = getProjects;
  }

  variables.blocked_user_ids = blockedUserIds;

  const response1 = await Hasura(queries, variables);

  if (response1.result.data.project.length === 0) {
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

  return res.json(cleanedPosts);
});

module.exports = getProject;
