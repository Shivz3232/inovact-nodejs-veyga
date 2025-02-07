const { query: Hasura } = require('../../../utils/hasura.js');
const catchAsync = require('../../../utils/catchAsync.js');
const { getCommentReplies, checkIfUserExists } = require('./queries/queries.js');

const DEFAULT_PAGE_SIZE = 10;

const getReplies = catchAsync(async (req, res) => {
  const { cognito_sub } = req.body;
  const { commentId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || DEFAULT_PAGE_SIZE;
  const offset = (page - 1) * limit;

  console.log(commentId);

  const checkUserExistsResponse = await Hasura(checkIfUserExists, {
    cognito_sub,
  });

  if (!checkUserExistsResponse.result.data.user) {
    return res.status(401).json({
      success: false,
      message: 'User does not exist',
    });
  }

  const variables = {
    commentId,
    limit,
    offset,
  };

  const response = await Hasura(getCommentReplies, variables);

  if (!response.result.data) {
    return res.status(404).json({
      success: false,
      message: 'Replies not found',
    });
  }

  const totalCount = response.result.data.post_comment_replies_aggregate.aggregate.count;
  const totalPages = Math.ceil(totalCount / limit);

  return res.status(200).json({
    success: true,
    data: response.result.data.post_comment_replies,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
});

module.exports = getReplies;
