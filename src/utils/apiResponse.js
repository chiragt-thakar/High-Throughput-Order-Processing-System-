const successResponse = (
  res,
  {
    statusCode = 200,
    message = 'Success',
    data = null,
  }
) => {
  return res.status(statusCode).json({
    statusCode,
    type: 'SUCCESS',
    message,
    result:data,
  });
};

const errorResponse = (
  res,
  {
    statusCode = 500,
    message = 'Internal server error',
    data = null,
  }
) => {
  return res.status(statusCode).json({
    statusCode,
    type: 'ERROR',
    message,
    result:data,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
