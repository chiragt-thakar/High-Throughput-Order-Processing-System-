const { Worker } = require('bullmq');
const redis = require('../config/redis');
const pool = require('../config/db');

const worker = new Worker(
  'order-queue',
  async (job) => {
    const startTime = Date.now();

    console.log(
      `[WORKER] Started job`,
      {
        jobId: job.id,
        orderId: job.data.orderId,
        attempt: job.attemptsMade + 1,
      }
    );

    try {

      await pool.query(
        `UPDATE orders
         SET status=$2, processed_at=NOW()
         WHERE id=$1`,
        [job.data.orderId, 'PROCESSING']
      );

      const processingTime = 5000;
      await new Promise((r) => setTimeout(r, processingTime));

      if (Math.random() < 0.15) {
        throw new Error('Payment gateway failed');
      }

      await pool.query(
        `UPDATE orders
         SET status=$2, processed_at=NOW()
         WHERE id=$1`,
        [job.data.orderId, 'COMPLETED']
      );

      const duration = Date.now() - startTime;



      return { durationMs: duration };
    } catch (err) {
      console.error(
        `[WORKER] Job failed`,
        {
          jobId: job.id,
          orderId: job.data.orderId,
          error: err.message,
          attempt: job.attemptsMade + 1,
        }
      );

      await pool.query(
        `UPDATE orders
         SET status=$2, processed_at=NOW()
         WHERE id=$1`,
        [job.data.orderId, 'FAILED']
      );

      throw err;
    }
  },
  {
    connection: redis,
    concurrency: 1,
  }
);
