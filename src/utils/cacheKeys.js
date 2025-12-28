exports.ordersList = (userId, role, page, limit) =>
  `orders:user:${userId}:role:${role}:page:${page}:limit:${limit}`;

exports.orderById = (orderId, role) =>
  `orders:order:${orderId}:role:${role}`;

exports.cacheHits = () => 'stats:cache:hits';
exports.dbHits = () => 'stats:db:hits';
