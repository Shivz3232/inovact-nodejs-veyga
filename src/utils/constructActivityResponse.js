const { query: Hasura } = require('./hasura');
const logger = require('../config/logger');

const entityMap = {
  signup: 'User Registration',
  BioUpdate: 'Bio field',
  SkillsUpdate: 'Skills listed',
  WebsiteUpdate: 'Website added',
  GithubUpdate: 'GitHub linked',
  thought: 'Thoughts shared',
};

const fetchUserEntities = async (userId) => {
  const query = `
    query GetUserEntities($userId: Int) {
      projects: project(where: { user_id: { _eq: $userId } }) {
        id
        title
      }
      ideas: idea(where: { user_id: { _eq: $userId } }) {
        id
        title
      }
    }
  `;

  try {
    const queryResponse = await Hasura(query, { userId });
    return {
      project: queryResponse.result.data.projects || [],
      idea: queryResponse.result.data.ideas || [],
    };
  } catch (error) {
    logger.error(`Error fetching user entities: ${error.message[0].message}`);
    return {
      project: [],
      idea: [],
    };
  }
};

const constructTitle = (entityType, entityId, userEntities) => {
  const entities = userEntities[entityType] || [];
  const entity = entities.find((e) => e.id === entityId);
  return entity ? entity.title : null;
};

const constructActivityResponse = async (res) => {
  const userEntities = await fetchUserEntities(res[0].user_id);
  const responseArray = [];

  for (const activity of res) {
    let title = null;

    if (activity.user_activity_entities && activity.user_activity_entities.length > 0) {
      try {
        if (activity.activity.entity_type === 'project' || activity.activity.entity_type === 'idea') {
          title = constructTitle(activity.activity.entity_type, activity.user_activity_entities[0].entity_id, userEntities);
        }
      } catch (titleError) {
        logger.error(`Error getting title for ${activity.activity.entity_type}: ${titleError}`);
      }
    }

    const response = {
      id: activity.id,
      userId: activity.user_id,
      activity: {
        id: activity.activity.id,
        identifier: activity.activity.identifier,
        title: activity.activity.title,
      },
      entityTitle: title || entityMap[activity.activity.entity_type],
      points: activity.activity.points,
      timestamp: activity.created_at,
    };

    responseArray.push(response);
  }

  return responseArray;
};

module.exports = constructActivityResponse;
