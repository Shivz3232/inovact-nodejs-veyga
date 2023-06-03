const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { delete_idea } = require('./queries/queries');

const deleteIdea = catchAsync(async (req, res) => {
  const id = await req.body.id;

  if (!id) {
    return res.json({
      success: false,
      errorCode: 'InvalidInput',
      errorMessage: 'Invalid or id not found',
      data: null,
    });
  }

  const variables = await {
    id,
  };
  const response = await Hasura(delete_idea, variables);

  if (!response.success) {
    console.log(response.errors);
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
