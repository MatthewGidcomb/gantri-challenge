const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

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

module.exports = app;
