const catchAsync = require('../../../utils/catchAsync');
const { query: Hasura } = require('../../../utils/hasura');
const { updateIdea_query } = require('./queries/queries');

const updateIdeas = catchAsync(async (req,res)=>{
  let variables = {
    id: {
      _eq: req.body.id,
    },
    changes: {},
  };

  const allowed_statuses = ['ideation', 'mvp/prototype', 'traction'];

  if (req.body.caption) variables['changes']['caption'] = req.body.caption;
  if (req.body.description)
    variables['changes']['description'] = req.body.description;
  if (req.body.title) variables['changes']['title'] = req.body.title;
  if (req.body.status && allowed_statuses.indexOf(req.body.status) > -1)
    variables['changes']['status'] = req.body.status;
  if (req.body.link) variables['changes']['link'] = req.body.link;

  const response = await Hasura(updateIdea_query, variables);

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
      errorMessage: 'Failed to update idea',
      data: JSON.stringify(response.errors),
    });
  }
});


module.exports = updateIdeas
