var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

// routes/index.jsで使えるようにグローバル変数の初期定義
global_val = "";

// socket.io関連処理

io.on('connection', function(socket){
  // クライアント側から反応があったら
  socket.on('sw status', function(sts){
    // グローバル変数へ代入
    global_val = sts;
    // console.log(sts);
  });
  console.log('a user connected');
  socket.on('disconnect', function(){
   console.log('user disconnected')
 });
});

// 諸事情あり、localhost:8000番でクライアントは立ち上げる
http.listen(8000, function(){
  console.log('listening on *:8000');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
