const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { updatePost_query } = require('./queries/queries');

const updateProject = catchAsync(async (req, res) => {
  let variables = await {
    id: {
      _eq: req.body.id,
    },
    changes: {},
  };
  // if (req.body.caption) variables['changes']['caption'] = req.body.caption;
  if (req.body.description) variables['changes']['description'] = req.body.description;
  if (req.body.title) variables['changes']['title'] = req.body.title;
  if (req.body.link) variables['changes']['link'] = req.body.link;

  const response = await Hasura(updatePost_query, variables);

  console.log(response)

  if (!response.success) {
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: '',
    });

  }

  return res.json({
    success: true,
    errorCode: '',
    errorMessage: '',
  });
});

module.exports = updateProject
