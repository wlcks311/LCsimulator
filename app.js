var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var serverRouter = require('./sql/server'); //
var loginRouter = require('./routes/login_s');//로그인
var registerRouter = require('./routes/register');
var insertUserRouter = require('./routes/insertUser');
var searchPageRouter = require('./routes/searchPage');
var findUserRouter = require('./routes/findUser');
var openChestRouter = require('./routes/openChest');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/server', serverRouter);
app.use('/login_s', loginRouter);
app.use('/register', registerRouter);
app.use('/insertUser', insertUserRouter);
app.use('/searchPage', searchPageRouter);
app.use('/findUser', findUserRouter);
app.use('/openChest', openChestRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
