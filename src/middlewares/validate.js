const { ZodError } = require('zod');
const { errorResponse } = require('../utils/apiResponse');

const formatZodErrors = (error) =>
  error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));

const validate = (schema) => (req, res, next) => {
  try {
    if (schema.body) req.body = schema.body.parse(req.body);
    if (schema.params) req.params = schema.params.parse(req.params);
    if (schema.query) req.query = schema.query.parse(req.query);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Validation failed',
        data: formatZodErrors(err),
      });
    }
    next(err);
  }
};

module.exports = { validate };
