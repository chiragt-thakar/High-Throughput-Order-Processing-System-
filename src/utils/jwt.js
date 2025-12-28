const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

exports.sign = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

exports.verify = (token) =>
  jwt.verify(token, JWT_SECRET);
