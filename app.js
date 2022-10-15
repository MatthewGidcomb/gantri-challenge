var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { db, sequelize } = require('./db/models');
var artRouter = require('./routes/art');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('sequelize', sequelize);

app.use('/api/art', artRouter);
app.use('/api/users', usersRouter);

module.exports = app;
