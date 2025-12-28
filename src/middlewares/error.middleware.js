const { errorResponse } = require('../utils/apiResponse');

module.exports = (err, req, res, next) => {
  console.error(err);

  return errorResponse(res, {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal server error',
    data: err.data || null,
  });
};
