const logger = require('../../../config/logger');
const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { deletequery } = require('./queries/queries');

const deleteProject = catchAsync(async (req, res) => {
  const id = await req.body.id;

  const variables = {
    id,
  };
  const response = await Hasura(deletequery, variables);

  if (!response.success) {
    logger.error(JSON.stringify(response.errors));

    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: '',
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

module.exports = deleteProject;
