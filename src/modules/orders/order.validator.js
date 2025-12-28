const { z } = require('zod');

const createOrderSchema = {
  body: z.object({
    product_name: z.string(),
    amount: z
      .number()
      .positive()
      .multipleOf(0.01, { message: 'Amount can have at most 2 decimal places' }),
  }),
};

const orderIdParamSchema = {
  params: z.object({
    id: z.string(),
  }),
};

module.exports = {
  createOrderSchema,
  orderIdParamSchema,
};
