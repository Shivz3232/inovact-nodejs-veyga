const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const cleanIdeaDoc = require('../../../utils/cleanIdeaDoc');
const { query: Hasura } = require('../../../utils/hasura');
const { getIdea, getIdeas: getIdeasQuery, getConnections } = require('./queries/queries');
const recommender = require('./recommender');

const getIdeas = catchAsync(async (req, res) => {
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

  const userId = response.result.data.user[0].id;

  const connections = {};
  response.result.data.connections.forEach((doc) => {
    if (doc.user1 === userId) {
      connections[doc.user2] = doc.status;
    } else {
      connections[doc.user1] = doc.status;
    }
  });

  let queries;
  let variables;

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

  if (response1.result.data.idea.length === 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'NotFound',
      errorMessage: 'Project not found',
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

  const recommendedIdeas = await recommender.recommend(cognito_sub, cleanedIdeas);

  // TODO: Pagination

  return res.json(recommendedIdeas);
});

module.exports = getIdeas;
