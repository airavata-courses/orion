var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var axios = require('axios');
var cors = require('cors')

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var registryRouter = require('./routes/gateway');
var api_helper = require('./routes/api_helper');

var app = express();
app.set('port', 3002);
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.get('/registry/status', function(req, resp, next) {
  console.log('This just called', req.body);
    axios
      .get('http://localhost:8091/registry/status')
      .then(res => {
        resp.send(res.data)
      })
});


app.post('/registry/status', function(req, resp, next) {
  console.log('Post Status just called', req.body);
  axios
    .post('http://localhost:8091/registry/status', req.body)
    .then( res => {
        resp.send(res.data)
    })
    .catch(err => console.log(err))
});

app.post('/plot', function(req, resp, next) {
  console.log('Post Plot just called', req.body);
  axios
    .post('http://localhost:8000/plotWeather/plotgraph', req.body)
    .then( res => {
        console.log('Got back res');
        console.log(res.data);
        resp.send(res.data)
    })
    .catch(err => console.log(err))
});

app.post('/ingestor', function(req, resp, next) {
  console.log('Ingestor just called', req.body);
    axios
      .get(`http://localhost:3001/api/uri/images/${req.body.year}/${req.body.month}/${req.body.day}/${req.body.hour}/${req.body.radar}`)
      .then(res => {
        console.log(res)
        resp.send(res.data)
      })
});

console.log("This is working");
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
