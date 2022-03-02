

var express = require('express');

var amqp = require('amqplib/callback_api');

// var args = process.argv.slice(2);

// if (args.length == 0) {
//   console.log("Usage: rpc_client.js num");
//   process.exit(1);
// }
var app = express();

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    channel.assertQueue('gateway_rx', {
      exclusive: false
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log("gateway_rx channel association successful");
      var correlationId = generateUuid();
      var num = 6;
      console.log(q);

      // console.log(' [x] Requesting fib(%d)', num);
      let date='2013-05-21'; let time='06:00'; let datacenter='KAMX'; 
      let data = {date, time, datacenter};
      let stringData = JSON.stringify(data);
      console.log("This is how it's getting sent:",stringData);
      channel.sendToQueue('ingestor_rx',
        Buffer.from(stringData),{
          
          // Buffer.from( data.toString()),{
          correlationId,
          replyTo: "gateway_rx" });

      channel.consume("gateway_rx", function(msg) {
        if (msg.properties.correlationId == correlationId) {
          var nLog = JSON.parse(msg.content.toString());
          console.log(' [.] Got');
          console.log(nLog);
          setTimeout(function() {
            connection.close();
            process.exit(0)
          }, 500);
        }
      }, {
        noAck: true
      });
    });
  });
});

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

module.exports = app;
/*var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const http = require("http");

var app = express();
var rpc_serv = require('./rabbitmq/rpc_server');
// var router = require("./routes/index")

app.use(cors({ credentials: true,
  origin: "http://localhost:3002",
    }));
// rpc_serv.connect();

var index = require('./routes/index');
var registry = require('./routes/registry');

// var apiHelper = require('./routes/apiHelper');
// view engine setup
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use("/index", index);
app.use("/registry", registry);

// const server = http.createServer(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
var port = process.env.PORT || '3004';

app.listen(port, () => console.log(`Listening on port ${port}`));

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost:5672', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    console.log("amqp connected");
  // create channel ,establiish connection and declare the queue
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'rpc_queue';

    channel.assertQueue(queue, {
      durable: false
    });
    // to spread the load equally over multiple servers we need to set the prefetch setting on the channel
    channel.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    channel.consume(queue, function reply(msg) {

    //   var n = parseInt(msg.content.toString());

    //   console.log(" [.] fib(%d)", n);

    //   var r = fibonacci(n); // function call. need to check with anita 
    console.log("msg"+msg.content.toJSON());
    var r= msg.content;
    console.log(r.toJSON());
      channel.sendToQueue(msg.properties.replyTo,
        Buffer.from(r.toString()), {
          correlationId: msg.properties.correlationId
        });

      channel.ack(msg);
    });
  });
});

module.exports = app;
*/