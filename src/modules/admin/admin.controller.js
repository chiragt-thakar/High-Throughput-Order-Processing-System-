const { successResponse } = require('../../utils/apiResponse');
const adminService = require('./admin.service');
const message = require('../../utils/messages.js')

exports.stats = async (req, res, next) => {
  try {
    const data = await adminService.getStats();

    return successResponse(res, {
      message: message.Admin_statistics_fetched_successfully,
      data
    });
  } catch (e) {
    next(e);
  }
};

exports.orders = async (req, res, next) => {
  try {
    const data = await adminService.getOrders({
      limit: req.query.limit,
      cursor: req.query.cursor,
      fromDate: req.query.fromDate,
      toDate: req.query.toDate,
      status: req.query.status,
      search: req.query.search
    });
    return successResponse(res, {
      message: message.Order_fetched_successfully,
      data
    });

  } catch (e) {
    next(e);
  }
};
