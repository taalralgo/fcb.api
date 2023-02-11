const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config()

const config = require("./config");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const passport = require("passport");

require('./models')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const newsRouter = require('./routes/news');
const liveRouter = require('./routes/live');
const videoRouter = require('./routes/video');

const app = express();

const __BASE_DIR= __dirname;

mongoose.set('strictQuery', false);
mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(result => console.log('MongoDb connected')).catch(error => console.log('Don`t connect MongoDB\n' + error));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors('*'));
// app.use(bodyParser.json({ type: "*/*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/news', newsRouter);
app.use('/api/lives', liveRouter);
app.use('/api/videos', videoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send();
});

module.exports = app;
