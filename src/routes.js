const router = require('express').Router();

router.use('/auth', require('./modules/auth/auth.routes'));
router.use('/orders', require('./modules/orders/orders.routes'));
router.use('/admin', require('./modules/admin/admin.routes'));

module.exports = router;
