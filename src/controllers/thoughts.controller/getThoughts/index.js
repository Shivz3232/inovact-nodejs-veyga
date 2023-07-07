const catchAsync = require('../../../utils/catchAsync');
const cleanThoughtDoc = require('../../../utils/cleanThoughtDoc');
const { query: Hasura } = require('../../../utils/hasura');
const { getThought, getThoughts: getThoughtsQuery, getConnections } = require('./queries/queries');

const getThoughts = catchAsync(async (req, res) => {
  const { cognito_sub } = req.body;
  const id = req.query.id;

  const response = await Hasura(getConnections, { cognito_sub });

  const userId = response.result.data.user[0].id;

  const connections = {};
  response.result.data.connections.forEach((doc) => {
    connections[doc.user1] = doc.status;

    if (doc.user1 === userId) {
      connections[doc.user2] = doc.status;
    }
  });

  let variables, queries;

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

  if (id) return res.status(200).json(cleanedThoughts[0]);
  return res.status(200).json(cleanedThoughts);
});

module.exports = getThoughts;
