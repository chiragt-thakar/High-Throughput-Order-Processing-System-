const { Queue } = require('bullmq');
const redis = require('./redis');

const orderQueue = new Queue('order-queue', {
  connection: redis
});

module.exports = orderQueue;
