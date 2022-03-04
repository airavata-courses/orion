var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var axios = require('axios');
var cors = require('cors')
const http = require("http");
const WebSocket = require("ws");
const serverSocket = require("./socket.js");
var app = express();

const port = 4000;

app.use(cors({ credentials: true,
  origin: "http://localhost:3002",
    }));

var index = require('./routes/index');
var apiHelper = require('./routes/apiHelper');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(index);

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
serverSocket.initWS(wss);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

app.post('/orionweather', function(req, resp, next) {
  // resp.header("Access-Control-Allow-Origin", "*");

  var entryId = -1;
  // From UI to Registry
  axios
  .post('http://localhost:8091/registry/newRequest',req.body)
  .then(responseFromReg => {
    entryId = responseFromReg.data;
  });
  // From Gateway to Ingestor
  axios
  .post('http://localhost:3001/api/uri/images/',req.body)
  .then(ingestorResponse => {
    let ingestorUri = ingestorResponse.data;
    // From Ingestor to Registry
    axios
      .post('http://localhost:8091/registry/ingestorResponse',{entryId, ingestorUri})
      .then(responseFromRegi => {
      });
    if(ingestorResponse.status == 200) {
      // From Gateway to Plot
      axios
      .post('http://localhost:8000/plotWeather/plotgraph',ingestorResponse.data)
      .then(responseFromPlotter => {

        // From Plotter to Registry
        let plotData = responseFromPlotter.data;
        axios
          .post('http://localhost:8091/registry/plotResponse',{entryId, plotData})
          .then(responseFromRegistry => {
          });
        resp.send(responseFromPlotter.data);
      })
    } else {
        resp.send().status(400);
        // io.emit("gateway", {status:{dataingestor:false, plot:false}});
        // // axios.put('http://localhost:3001/status').status(400);
      }
    });
});

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

server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
