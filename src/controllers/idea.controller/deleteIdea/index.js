const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { delete_idea } = require('./queries/queries');

const deleteIdea = catchAsync(async (req, res) => {
  const id = req.body.id;

  const variables = {
    id,
  };
  const response = await Hasura(delete_idea, variables);

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = deleteIdea;
