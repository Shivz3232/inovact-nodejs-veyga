// const httpStatus = require('http-status');
// const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
// const { userService } = require('../services');

const getConnections = catchAsync(async (req, res) => {
  // const user = await userService.getUserById(req.params.userId);
  // if (!user) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  // }
  // res.send(user);
});

module.exports = {
  // createUser,
  // getUsers,
  getConnections,
  // updateUser,
  // deleteUser,
};
