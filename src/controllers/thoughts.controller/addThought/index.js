const { validationResult } = require('express-validator');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { addThought, updateUserFlags } = require('./queries/mutations');
const { getUser, getThought, getMyConnections } = require('./queries/queries');
const cleanConnections = require('../../../utils/cleanConnections');
const enqueueEmailNotification = require('../../../utils/enqueueEmailNotification');

const addThoughts = catchAsync(async (req, res) => {
  const sanitizerErrors = validationResult(req);
  if (!sanitizerErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      ...sanitizerErrors,
    });
  }
  // Find user id
  const { cognito_sub } = req.body;

  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  const thoughtData = {
    thought: req.body.thought,
    user_id: response1.result.data.user[0].id,
  };

  const response2 = await Hasura(addThought, thoughtData);

  // Send email notification
  const { id: actorId } = response1.result.data.user[0];
  const { id: thoughtId } = response2.result.data.insert_thoughts.returning[0];

  // get connection usernids
  const getConnectionsResponse = await Hasura(getMyConnections, {
    cognito_sub,
  });

  const userConnectionIds = cleanConnections(getConnectionsResponse.result.data.connections, actorId);

  if (userConnectionIds.length > 0) {
    enqueueEmailNotification(12, thoughtId, actorId, userConnectionIds);
  }

  // Congratualate the user for the acheivment
  enqueueEmailNotification(11, thoughtId, actorId, [actorId]);

  const userEventFlags = response1.result.data.user[0].user_action;

  if (!userEventFlags.has_uploaded_thought) {
    userEventFlags.has_uploaded_thought = true;
    await Hasura(updateUserFlags, { userId: actorId, userEventFlags });
  }

  return res.status(201).json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = addThoughts;
