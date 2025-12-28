const router = require('express').Router();
const c = require('./orders.controller');
const auth = require('../../middlewares/auth.middleware');
const rate = require('../../middlewares/rateLimit.middleware');
const { validate } = require('../../middlewares/validate');
const { createOrderSchema, orderIdParamSchema } = require('./order.validator');
const roleCheck = require('../../middlewares/role.middleware')

router.post('/', validate(createOrderSchema), auth, roleCheck("USER"), rate.createOrderLimiter, c.create);
router.get('/', auth, roleCheck("USER"), rate.getOrdersLimiter, c.list);
router.get('/:id', validate(orderIdParamSchema), auth, roleCheck("USER"), c.get);

module.exports = router;
