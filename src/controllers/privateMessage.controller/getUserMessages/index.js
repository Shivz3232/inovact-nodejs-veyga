const { validationResult } = require('express-validator');
const { query: Hasura } = require('../../../utils/hasura');
const { getUserConnections } = require('./queries/queries');
const { decryptMessage } = require('../../../utils/decryptMessage');
const catchAsync = require('../../../utils/catchAsync');

const cleanupResponse = async (connections) => {
  const transformedConnections = await Promise.all(
    connections.map(async (connection) => {
      const { private_messages, ...rest } = connection;
      const latestMessage = private_messages.length
        ? {
            message: await decryptMessage(private_messages[0].encrypted_message),
            created_at: private_messages[0].created_at,
            messageSenderId: private_messages[0].primary_user_id,
            messageReceiverId: private_messages[0].secondary_user_id,
          }
        : null;

      const numberOfUnreadMessages = connection.private_messages_aggregate.aggregate.count;
      delete rest.private_messages_aggregate;

      return { ...rest, latestMessage, numberOfUnreadMessages };
    })
  );

  transformedConnections.sort((a, b) => {
    const aDate = a.latestMessage ? new Date(a.latestMessage.created_at) : new Date(0);
    const bDate = b.latestMessage ? new Date(b.latestMessage.created_at) : new Date(0);
    return bDate - aDate;
  });

  return transformedConnections;
};

const getUserMessages = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);

  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }

  const { cognito_sub } = req.body;
  const pageSize = parseInt(req.query.pageSize, 10) || 20;
  const pageNumber = parseInt(req.query.pageNumber, 10) || 1;
  const offset = (pageNumber - 1) * pageSize;

  const response1 = await Hasura(getUserConnections, { cognito_sub, limit: pageSize, offset });

  const totalItems = response1.result.data.connections_aggregate.aggregate.count;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (pageNumber > totalPages) {
    return res.json({
      data: [],
      pagination: {
        page: pageNumber,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: false,
        hasPreviousPage: totalPages > 0,
      },
    });
  }

  const cleanedResponse = await cleanupResponse(response1.result.data.connections);

  return res.json({
    data: cleanedResponse,
    pagination: {
      page: pageNumber,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPreviousPage: pageNumber > 1,
    },
  });
});

module.exports = getUserMessages;
