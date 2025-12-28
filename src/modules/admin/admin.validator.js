const { z } = require('zod');

const getOrdersSchema = z.object({
  limit: z
    .preprocess(val => Number(val), z.number().int().positive().max(100))
    .optional()
    .default(10),

  cursor: z
    .string()
    .datetime({ offset: true })
    .optional()
    .nullable(),

  fromDate: z
    .string()
    .datetime({ offset: true })
    .optional()
    .nullable(),

  toDate: z
    .string()
    .datetime({ offset: true })
    .optional()
    .nullable(),

  status: z
    .enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'])
    .optional()
    .nullable(),

  search: z
    .string()
    .min(1)
    .max(100)
    .optional()
    .nullable()
}).refine(
  data => {
    if (data.fromDate && data.toDate) {
      return new Date(data.fromDate) <= new Date(data.toDate);
    }
    return true;
  },
  {
    message: 'fromDate must be before or equal to toDate',
    path: ['fromDate']
  }
);

module.exports = { getOrdersSchema };
