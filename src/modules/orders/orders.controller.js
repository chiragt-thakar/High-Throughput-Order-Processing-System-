const { successResponse } = require('../../utils/apiResponse');
const service = require('./orders.service');
const message = require('../../utils/messages.js')

exports.create = async (req, res, next) => {
  try {
    const order = await service.create(req.user, req.body);

    return successResponse(res, {
      message: message.Order_created_successfully,
      data: order,
      statusCode: 201,
    });
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const orders = await service.list(req.user, page, limit);

    return successResponse(res, {
      message: message.Order_fetched_successfully,
      data: orders
    });
  } catch (e) {
    next(e);
  }
};

exports.get = async (req, res, next) => {
  try {
    const order = await service.getById(req.params.id);

    return successResponse(res, {
      message: message.Order_fetched_successfully,
      data: order,
    });
  } catch (e) {
    next(e);
  }
};
