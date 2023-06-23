const { query: Hasura } = require('../../../utils/hasura');
const { deleteAreaOfInterest: deleteAreaOfInterestQuery } = require('./queries/mutations');
const catchAsync = require('../../../utils/catchAsync');
const logger = require('../../../config/logger');

const deleteAreaOfInterest = catchAsync(async (req, res) => {
  const { cognito_sub, interest_ids } = req.body;

  const variables = {
    cognito_sub,
    interest_ids,
  };

  const response = await Hasura(deleteAreaOfInterestQuery, variables);

  if (!response.success) {
    logger.error(JSON.stringify(response.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });
  }

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = deleteAreaOfInterest;
