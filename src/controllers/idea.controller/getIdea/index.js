const logger = require('../../../config/logger');
const catchAsync = require('../../../utils/catchAsync');
const cleanIdeaDoc = require('../../../utils/cleanIdeaDoc');
const { query: Hasura } = require('../../../utils/hasura');
const { getIdea, getIdeas: getIdeasQuery, getConnections } = require('./queries/queries');

const getIdeas = catchAsync(async (req, res) => {
  const { cognito_sub } = req.body;
  const id = req.query.id;

  const response = await Hasura(getConnections, { cognito_sub });

  if (!response.success) {
    logger.error(JSON.stringify(response.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find login user',
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

  let queries, variables;

  if (id) {
    variables = {
      id,
      cognito_sub,
    };
    queries = getIdea;
  } else {
    variables = {
      cognito_sub,
    };

    queries = getIdeasQuery;
  }

  const response1 = await Hasura(queries, variables);

  if (!response1.success) {
    logger.error(JSON.stringify(response1.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });
  }

  const cleanedIdeas = response1.result.data.idea.map((doc) => {
    doc = cleanIdeaDoc(doc);
    doc.connections_status = connections[doc.user.id] ? connections[doc.user.id] : 'not connected';
    return doc;
  });

  if (id) {
    return res.json(cleanedIdeas[0]);
  }

  return res.json(cleanedIdeas);
});

module.exports = getIdeas;
