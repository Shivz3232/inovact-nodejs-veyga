const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { delete_idea } = require('./queries/queries');

const deleteIdea = catchAsync(async (req,res)=>{
  const id = await req.body.id;

  if (id) {
    const variables = await {
      id,
    };
    const response = await Hasura(delete_idea, variables);

    if (response.success) {
      res.json({
        success: true,
        errorCode: '',
        errorMessage: '',
        data: null,
      });
    } else {
      res.json({
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: 'Failed to delete thought',
        data: null,
      });
    }
  } else {
    res.json({
      success: false,
      errorCode: 'InvalidInput',
      errorMessage: 'Invalid or id not found',
      data: null,
    });
  }
});

module.exports = deleteIdea
