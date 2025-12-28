const router = require('express').Router();
const c = require('./auth.controller');
const auth = require('../../middlewares/auth.middleware');
const { registerSchema, loginSchema } = require('./auth.validator');
const { validate } = require('../../middlewares/validate');

router.post('/register',validate(registerSchema), c.register);
router.post('/login', validate(loginSchema), c.login);
router.get('/me', auth, c.me);

module.exports = router;