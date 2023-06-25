const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { deletequery } = require('./queries/queries');

const deleteProject = catchAsync(async (req, res) => {
  const id = req.body.id;

  const variables = {
    id,
  };
  const response = await Hasura(deletequery, variables);

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
});

module.exports = deleteProject;
