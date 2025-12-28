const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const orderQueue = require('./bullmq');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/bull_admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(orderQueue)
  ],
  serverAdapter
});

module.exports = serverAdapter;
