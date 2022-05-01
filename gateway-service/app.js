var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var amqp = require("amqplib/callback_api");

let respList = [];
var connectionVar;
var channelVar;

const http = require("http");
const WebSocket = require("ws");
// const serverSocket = require("./socket.js");
var app = express();

const port = 4000;

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

// var index = require('./routes/index');
var registry = require("./routes/registry");
// const { syncBuiltinESMExports } = require('module');
// const { channel } = require('diagnostics_channel');

// var apiHelper = require('./routes/apiHelper');
// view engine setup
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
// app.use("/index", index);
app.use("/registry", registry);

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
//const sendMessage = serverSocket.initWS(wss);

const ws_connections = [];
wss.on("connection", (ws) => {
  //connection is up, let's add a simple simple event
  // var ws_connections = [];
  ws_connections.push(ws);
  // ws.on("open", () => {
  //   console.log("Added a websocket to the list");
  // //   ws_connections.push(ws);
  // });

  ws.on("message", (message) => {
    //log the received message and send it back to the client
    console.log("received: %s", message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  ws.on("close", (event) => {
    console.log("Removed a websocket to the list",  ws);
  });

});
  amqp.connect("amqp://orion-rabbit", ampqConnectionInit);

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
  var correlationIds = [];

  app.post("/nexrad", postHandler);
  app.post("/merra", merraPostHandler);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  function generateUuid() {
    return Date.now().valueOf().toString();
  }

  function ampqConnectionInit(error0, connection) {
    if (error0) {
      throw error0;
    }
    console.log("Connection to Rabbit MQ successful");
    connectionVar = connection;
    connectionVar.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      console.log("Channel created for Rabbit MQ");
      channelVar = channel;
    });
  }

  function ampqConnectionHandler(error0, connection) {
    if (error0) {
      respBody = { error: "Could not create connection" };
      console.log(respBody);
      throw error0;
    }
    console.log("We have connection now", connection);
    connectionVar = connection;
  }

  function ampqChannelHandler(error1, channel) {
    if (error1) {
      respBody = { error: "Could not create channel" };
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
    if (!connectionVar) {
      amqp.connect("amqp://orion-rabbit", ampqConnectionHandler);
    }
    if (!channelVar) {
      connectionVar.createChannel(ampqChannelHandler);
    }
    channelVar.assertQueue("plot_tx", {
      exclusive: false,
      durable: false,
    });
    channelVar.assertQueue(
      "plot_rx",
      {
        exclusive: false,
        durable: false,
      },
      function (error2, q) {
        if (error2) {
          respBody = { error: "Could not connect to queue to send message" };
          console.log(respBody);
          throw error2;
        }
        console.log("plot_rx channel association successful");
        var correlationId = generateUuid(req.body.userEmail);
        correlationIds.push(correlationId);
        resp.json({ correlationId: correlationId }).send();
        let stringData = JSON.stringify(req.body);
        console.log("This is how it's getting sent: ", stringData);
        channelVar.sendToQueue("ingestor_rx", Buffer.from(stringData), {
          correlationId,
          replyTo: "plot_rx",
        });
      }
    );

    var mLog;
    channelVar.consume(
      "plot_tx",
      function (msg) {
        let correlationRecv = msg.properties.correlationId;
        if (correlationIds.indexOf(correlationRecv) > -1) {
          correlationIds.filter(function (value, index, arr) {
            return value != correlationRecv;
          });

          console.log(
            " [.] Received from plot queue: ",
            msg.content.toString()
          );

          if(ws_connections.length>0) {
            console.log("These are the connections", ws_connections);
            var index = 0;
            let msg_str = msg.content.toString();
            msg_str[1]="\"";
            msg_str[msg_str.length-2]="\"";
            while(index<ws_connections.length) {
              if(ws_connections[index].readyState === WebSocket.OPEN) {
                ws_connections[index].send(msg_str);//msg.content.toString());
                console.log(msg_str,"Sent as msg");
              } else {
                console.log("Websocket State: [", index,"]", ws_connections[index].readyState);
              }
              index++;
            }
          } else {
            console.log("no WS connections available");
          }
        }
      },
      {
        noAck: true,
      }
    );
    return;
  }

  async function merraPostHandler(req, resp, next) {
    let respBody;
    // resp.header("Access-Control-Allow-Origin", "*");
    console.log("Received POST request for merra data");
    console.log(req.body);
    if (!connectionVar) {
      amqp.connect("amqp://orion-rabbit", ampqConnectionHandler);
    }
    if (!channelVar) {
      connectionVar.createChannel(ampqChannelHandler);
    }
    channelVar.assertQueue("merra_plot_rx", {
      exclusive: false,
      durable: false,
    });
    channelVar.assertQueue(
      "merra_plot_tx",
      {
        exclusive: false,
        durable: false,
      },
      function (error2, q) {
        if (error2) {
          respBody = { error: "Could not connect to queue to send message" };
          console.log(respBody);
          throw error2;
        }
        console.log("merra_plot_rx channel association successful");
        var correlationId = generateUuid(req.body.userEmail);
        correlationIds.push(correlationId);
        resp.json({ correlationId: correlationId }).send();
        let stringData = JSON.stringify(req.body);
        console.log("This is how it's getting sent: ", stringData);
        channelVar.sendToQueue("merra_plot_rx", Buffer.from(stringData), {
          correlationId,
          replyTo: "merra_plot_tx",
        });
      }
    );

    var mLog;
    channelVar.consume(
      "merra_plot_tx",
      function (msg) {
        let correlationRecv = msg.properties.correlationId;
        if (correlationIds.indexOf(correlationRecv) > -1) {
          correlationIds.filter(function (value, index, arr) {
            return value != correlationRecv;
          });

          console.log(
            " [.] Received from plot queue: ",
            msg.content.toString()
          );
          var returnData = {};
          returnData["dataMode"] = "MERRA";
          returnData["response"] = msg.content.toString();

          if(ws_connections.length>0) {
            console.log("These are the connections", ws_connections);
            var index = 0;
            while(index<ws_connections.length) {
              if(ws_connections[index].readyState === WebSocket.OPEN) {
                ws_connections[index].send(msg.content.toString());
                console.log(msg.content.toString(),"Sent as msg");
              } else {
                console.log("Websocket State: [", index,"]", ws_connections[index].readyState);
              }
              index++;
            }
          } else {
            console.log("no WS connections available");
          }
        }
      },
      {
        noAck: true,
      }
    );
    return;
  }
// });

server.listen(port, () => console.log(`Listening on port ${port}`));
module.exports = app;
