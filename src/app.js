const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const serverAdapter = require('./config/bull-board');
const hpp = require('hpp');


const app = express();

app.use(helmet());      

app.use(hpp());

const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/bull_admin/queues', serverAdapter.getRouter());

app.use('/api', routes);

app.use(errorMiddleware);

module.exports = app;
