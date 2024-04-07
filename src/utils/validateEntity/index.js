const { query: Hasura } = require('../hasura');
const { findIdea, findProject, findThought } = require('./queries/queries');

const identifierMap = {
  'sharing-idea': {
    query: findIdea,
    property: 'idea',
  },
  'sharing-thought': {
    query: findThought,
    property: 'thoughts',
  },
  'sharing-project': {
    query: findProject,
    property: 'project',
  },
};

const validateEntity = async (identifier, id) => {
  const entityInfo = identifierMap[identifier];

  if (!entityInfo) {
    return false;
  }

  const { query, property } = entityInfo;
  const queryResponse = await Hasura(query, { id });

  if (queryResponse.result.data[property].length === 0) {
    throw new Error('Invalid Entity ID Provided');
  }

  return true;
};

module.exports = validateEntity;
