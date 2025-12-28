const service = require('./auth.service');
const { successResponse } = require('../../utils/apiResponse');

exports.register = async (req, res, next) => {
  try {
    const user = await service.register(req.body);

    return successResponse(res, {
      statusCode: 201,
      message: 'User registered successfully',
      data: user,
    });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await service.login(req.body);

    return successResponse(res, {
      message: 'Login successful',
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

exports.me = async (req, res) => {
  return successResponse(res, {
    message: 'User profile fetched successfully',
    data: req.user,
  });
};
