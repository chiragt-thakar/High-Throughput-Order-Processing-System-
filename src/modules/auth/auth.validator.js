const { z } = require('zod');

/**
 * REGISTER
 */
const registerSchema = {
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50)
      .trim(),

    email: z
      .string()
      .email('Invalid email address')
      .trim(),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(64)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        'Password must contain uppercase, lowercase and number'
      )
      .trim(),
  }),
};

/**
 * LOGIN
 */
const loginSchema = {
  body: z.object({
    email: z
      .string()
      .email('Invalid email address')
      .trim(),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .trim(),
  }),
};

module.exports = {
  registerSchema,
  loginSchema,
};
