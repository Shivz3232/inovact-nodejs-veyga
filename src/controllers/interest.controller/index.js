const axios = require('axios');
const { query: Hasura } = require('../../utils/hasura');
const { getAreaOfInterests } = require('./queries/queries');
const catchAsync = require('../../utils/catchAsync');

const getInterest = catchAsync(async (req,res)=>{
  const response = await Hasura(getAreaOfInterests);

  if (!response.success) {
    return res.json(response.errors);
    
  }
  return res.json(response.result.data.area_of_interests);
});

module.exports = getInterest
