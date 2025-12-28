const router = require('express').Router();
const c = require('./admin.controller');
const auth = require('../../middlewares/auth.middleware');
const role = require('../../middlewares/role.middleware');
const { validate } = require('../../middlewares/validate');
const { getOrdersSchema } = require('./admin.validator');

router.use(auth, role('ADMIN'));
router.get('/stats',auth, role('ADMIN'), c.stats);
router.get('/orders',validate(getOrdersSchema),auth, role('ADMIN'), c.orders);

module.exports = router;
