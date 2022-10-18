const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('gantri-challenge:app');

const { sequelize } = require('./db/models');
const artRouter = require('./routes/art');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev', { skip: () => process.env.NODE_ENV === 'test' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('sequelize', sequelize);

app.use('/api/art', artRouter);
app.use('/api/users', usersRouter);

// 404 (explicitly defined to make the response JSON, for consistency across API)
app.use(function (req, res) {
  res.status(404).json({ message: 'not found' });
});

// general error-handler
app.use(function (err, req, res, next) {
  debug(err);
  res.status(500).json({ message: 'an unknown error occurred' });
});

module.exports = app;
