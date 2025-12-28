const pool = require('../../config/db');
const redis = require('../../config/redis');
const keys = require('../../utils/cacheKeys');


exports.getStats = async () => {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'COMPLETED') AS completed_orders,
      COUNT(*) FILTER (WHERE status = 'FAILED') AS failed_orders,
      AVG(EXTRACT(EPOCH FROM (processed_at - created_at))) AS avg_processed_time
    FROM orders;
  `);

  const cacheHits = Number(await redis.get(keys.cacheHits()) || 0);
  const dbHits = Number(await redis.get(keys.dbHits()) || 0);

  return {
    ...rows[0],
    cache: {
      cacheHits,
      dbHits,
      cacheHitRatio:
        cacheHits + dbHits === 0
          ? 0
          : ((cacheHits / (cacheHits + dbHits)) * 100).toFixed(2) + '%'
    }
  };
};

exports.getOrders = async ({
  limit = 10,
  cursor = null,
  fromDate = null,
  toDate = null,
  status = null,
  search = null
}) => {
  limit = Number(limit);

  const conditions = [];
  const values = [];
  let idx = 1;

  if (cursor) {
    conditions.push(`orders.created_at < $${idx}`);
    values.push(cursor);
    idx++;
  }

  if (fromDate) {
    conditions.push(`orders.created_at >= $${idx}`);
    values.push(fromDate);
    idx++;
  }

  if (toDate) {
    conditions.push(`orders.created_at <= $${idx}`);
    values.push(toDate);
    idx++;
  }

  if (status) {
    conditions.push(`orders.status = $${idx}`);
    values.push(status);
    idx++;
  }

  if (search) {
    conditions.push(`
      (
        orders.product_name ILIKE $${idx}
        OR users.name ILIKE $${idx}
        OR CAST(orders.amount AS TEXT) ILIKE $${idx}
      )
    `);
    values.push(`%${search}%`);
    idx++;
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  values.push(limit);

  const query = `
    SELECT
      orders.*,
      users.id AS user_id,
      users.name AS user_name
    FROM orders
    LEFT JOIN users ON orders.user_id = users.id
    ${whereClause}
    ORDER BY orders.created_at DESC
    LIMIT $${idx};
  `;

  const { rows } = await pool.query(query, values);

  const nextCursor =
    rows.length > 0 ? rows[rows.length - 1].created_at : null;

  return {
    pagination: {
      limit,
      nextCursor
    },
    filters: {
      fromDate,
      toDate,
      status,
      search
    },
    orderData: rows
  };
};


