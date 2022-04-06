
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var amqp = require('amqplib/callback_api');

let respList = [];
var connectionVar;
var channelVar;

amqp.connect('amqp://orion-rabbit', ampqConnectionInit);

const http = require("http");
const WebSocket = require("ws");
const serverSocket = require("./socket.js");
var app = express();

//const port = 4000;

app.use(cors({ credentials: true,
  origin: "*",
    }));

// var index = require('./routes/index');
var registry = require('./routes/registry');
// const { syncBuiltinESMExports } = require('module');
// const { channel } = require('diagnostics_channel');

// var apiHelper = require('./routes/apiHelper');
// view engine setup
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use("/index", index);
app.use("/registry", registry);

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
serverSocket.initWS(wss);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
var port = process.env.PORT || '4000';
var correlationIds = [];
app.listen(port, () => console.log(`Listening on port ${port}`));

app.post('/orionweather', postHandler);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

function ampqConnectionInit(error0, connection) {
  if (error0) {
    throw error0;
  }
  console.log("Connection to Rabbit MQ successful");
  connectionVar = connection;
  connectionVar.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    console.log("Channel created for Rabbit MQ");
    channelVar = channel;
  });
}

function ampqConnectionHandler(error0, connection) {
  if (error0) {
    respBody = {"error":"Could not create connection"};
    console.log(respBody);
    throw error0;
  }
  console.log("We have connection now",connection);
  connectionVar = connection;
}

function ampqChannelHandler(error1, channel) {
  if (error1) {
    respBody = {"error":"Could not create channel"};
    console.log(respBody);
    // resp.json(respBody).status(500);
    throw error1;
  }
  console.log("Channel Created now");
  channelVar = channel;
}

async function postHandler(req, resp, next) {
  let respBody;
  // resp.header("Access-Control-Allow-Origin", "*");
  console.log("Received POST request at orionweather");
  console.log(req.body);
  if(!connectionVar) {
    amqp.connect('amqp://orion-rabbit', ampqConnectionHandler);
  }
  if(!channelVar) {
    connectionVar.createChannel(ampqChannelHandler);
  }

  channelVar.assertQueue('ingestor_tx', {
    exclusive: false
  }, function(error2, q) {
    if (error2) {
      respBody = {"error":"Could not connect to queue to send message"};
      console.log(respBody);
      throw error2;
    }
    console.log("ingestor_tx channel association successful");
    var correlationId = generateUuid();
    correlationIds.push(correlationId);
    let stringData = JSON.stringify(req.body);
    console.log("This is how it's getting sent: ",stringData);
    channelVar.sendToQueue('ingestor_rx',
      Buffer.from(stringData),{
        correlationId,
        replyTo: "ingestor_tx" });
  });
  var nLog;
  channelVar.consume('ingestor_tx', function(msg) {
    let correlationRecv = msg.properties.correlationId;
    if (correlationIds.indexOf(correlationRecv)>-1) {
      correlationIds.filter(function(value, index, arr){ 
        return value != correlationRecv;
      });
      nLog = JSON.parse(msg.content.toString());
      console.log(' [.] Received from queue: ', nLog);
      respList.push(nLog);
    }
  }, {
    noAck: true
  });

  await sleep(2000);
  let val = respList.pop();
  console.log(val);

  channelVar.assertQueue('plot_tx', {
    exclusive: false
  }, function(error2, q) {
    if (error2) {
      respBody = {"error":"Could not connect to queue to send message"};
      console.log(respBody);
      throw error2;
    }
    console.log("plot_tx channel association successful");
    var correlationId = generateUuid();
    correlationIds.push(correlationId);
    let stringData = JSON.stringify(val);
    console.log("This is how it's getting sent to plot: ",stringData);
    channelVar.sendToQueue('plot_rx',
      Buffer.from(stringData),{
        correlationId,
        replyTo: "plot_tx" });
  });

  channelVar.consume("plot_tx", function(msg) {
    let correlationRecv = msg.properties.correlationId;
    if (correlationIds.indexOf(correlationRecv)>-1) {
      correlationIds.filter(function(value, index, arr){ 
        return value != correlationRecv;
      });
      nLog = JSON.parse(msg.content.toString());
      console.log(' [.] Received from queue: ', nLog);
      respList.push(nLog);
      
    }
  }, {
    noAck: true
  });

  await sleep(20000);
  let val2 = respList.pop();
  console.log(val2);

  resp.json(val2).status(200).send();
  return;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = app;
