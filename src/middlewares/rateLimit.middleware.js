const rateLimit = require('express-rate-limit');

exports.createOrderLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.user.id.toString(),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many order creation requests. Please try again later.'
    });
  }
});

exports.getOrdersLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 30,
  keyGenerator: (req) => req.user.id.toString(),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many requests. Please try again later.'
    });
  }
});
