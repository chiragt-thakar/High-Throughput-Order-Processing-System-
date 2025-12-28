const pool = require('../../config/db');
const queue = require('../../config/bullmq');
const redis = require('../../config/redis');
const keys = require('../../utils/cacheKeys');

exports.create = async (loginUser, body) => {
  const { product_name, amount } = body;
  const { rows } = await pool.query(`
    INSERT INTO orders ( user_id, product_name, amount, status)
    VALUES ($1, $2, $3, 'PENDING')
    RETURNING *;`, [
    loginUser.id,
    product_name,
    amount

  ]);

  const startTime = Date.now();



  const job = await queue.add(
    'process',
    { orderId: rows[0].id },
    {
      jobId: `order-${rows[0].id}`,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
      removeOnComplete: true,
      removeOnFail: true,
    }
  );

  console.log('[QUEUE] Job added successfully', {
    jobId: job.id,
    orderId: rows[0].id,
    attempts: job.opts.attempts,
    backoff: job.opts.backoff,
    removeOnComplete: job.opts.removeOnComplete,
    removeOnFail: job.opts.removeOnFail,
    enqueueDurationMs: Date.now() - startTime,
  });


  const pattern = `orders:user:${loginUser.id}:role:${loginUser.role}:page:*`;

  const keysToDelete = await redis.keys(pattern);


  if (keysToDelete.length) {
    await redis.del(keysToDelete);
  }

  return rows[0];
};

exports.list = async (loginUser, page = 1, limit = 10) => {
  page = Number(page);
  limit = Number(limit);

  const key = keys.ordersList(loginUser.id, loginUser.role, page, limit);
  const cached = await redis.get(key);
  if (cached) {
    await redis.incr(keys.cacheHits());
    return JSON.parse(cached);
  };

  await redis.incr(keys.dbHits());

  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT *
    FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM orders
    WHERE user_id = $1;
  `;

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, [loginUser.id, limit, offset]),
    pool.query(countQuery, [loginUser.id])
  ]);

  const totalItems = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(totalItems / limit);

  const response = {
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
    orderData: dataResult.rows

  };

  await redis.setex(key, 30, JSON.stringify(response));
  return response;
};


exports.getById = async (id) => {
  const key = keys.orderById(id);
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const { rows } = await pool.query(`
SELECT 
    orders.*, 
    users.id AS user_id, 
    users.name AS user_name
FROM orders
LEFT JOIN users ON orders.user_id = users.id
WHERE orders.id = $1;
`, [id]);
  if (rows[0]) await redis.setex(key, 30, JSON.stringify(rows[0]));
  return rows[0];
};
