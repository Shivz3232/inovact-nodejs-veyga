const logger = require('../../../config/logger');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { delete_idea } = require('./queries/queries');

const deleteIdea = catchAsync(async (req, res) => {
  const id = req.body.id;

  const variables = {
    id,
  };
  const response = await Hasura(delete_idea, variables);

  if (!response.success) {
    logger.error(JSON.stringify(response.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to delete thought',
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

module.exports = deleteIdea;
