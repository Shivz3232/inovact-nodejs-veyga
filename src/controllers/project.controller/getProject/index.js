const { query: Hasura } = require('../../../utils/hasura');
const { getProjects, getProject: getProjectQuery, getConnections } = require('./queries/queries');
const cleanPostDoc = require('../../../utils/cleanPostDoc');
const catchAsync = require('../../../utils/catchAsync');

const getProject = catchAsync(async (req, res) => {
  const { cognito_sub } = req.body;
  const id = req.query.id;

  const response = await Hasura(getConnections, { cognito_sub });

  const userId = response.result.data.user[0].id;

  const connections = {};
  response.result.data.connections.forEach((doc) => {
    if (doc.user1 === userId) {
      connections[doc.user2] = doc.status;
    } else {
      connections[doc.user1] = doc.status;
    }
  });

  let queries, variables;

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

  const response1 = await Hasura(queries, variables);

  if (response1.result.data.project.length === 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'NotFound',
      errorMessage: 'Project not found',
      data: null,
    });
  }

  const cleanedPosts = response1.result.data.project.map((doc) => {
    doc = cleanPostDoc(doc);
    doc.connections_status = connections[doc.user.id] ? connections[doc.user.id] : 'not connected';
    return doc;
  });

  if (id) return res.status(200).json(cleanedPosts[0]);

  return res.status(200).json(cleanedPosts);
});

module.exports = getProject;
