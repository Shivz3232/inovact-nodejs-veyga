const axios = require('axios');
const { query: Hasura } = require('../../utils/hasura');
const { getTags, getTagsWithPrefix } = require('./queries/queries');
const catchAsync = require('../../utils/catchAsync');

const getTag = catchAsync(async (req, res) => {

    const prefix = req.body.prefix;

    let response;
    if (prefix) {
        response = await Hasura(getTagsWithPrefix, {
            _tag: prefix + '%',
        });
    } else {
        response = await Hasura(getTags);
    }

    if (response.success) {
        return res.json(response.result.data.hashtag)
        // callback(null, response.result.data.hashtag);
    } else {
        return res.json(response.errors)
        // callback(null, response.errors);
    }
});


module.exports = getTag