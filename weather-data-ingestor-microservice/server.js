
// const express = require('express')
const controller = require('./api/controller');
console.log(controller)
const AWS = require('aws-sdk');
var S3 = new AWS.S3({ region: 'us-east-1', maxRetries: 15});

var BucketConfig = {
  Bucket: 'noaa-nexrad-level2',
  Delimiter: '/',
};

// amqplib is a protocol for  messaging . So use that 
var amqp = require('amqplib/callback_api');
//connect to the rabitmq server

amqp.connect('amqp://orion-rabbit', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  console.log("Connection established with rabbitMQ");
  // create channel ,establiish connection and declare the queue
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    console.log("Channel connected");
    var queue = 'ingestor_rx';
    channel.assertQueue(queue, {
      durable: false
    });
    // to spread the load equally over multiple servers we need to set the prefetch setting on the channel
    channel.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    channel.consume(queue, function reply(msg) {
      var userInput = JSON.parse(msg.content.toString());
      var ingestorRes;
      const [hour, time] = userInput.time.split(":");
      const datacenter = userInput.datacenter;
      const [year, month, day] = userInput.date.split("-")
      BucketConfig.Prefix = `${year}/${month}/${day}/${datacenter}/`;

      S3.makeUnauthenticatedRequest('listObjects', BucketConfig, (err, data) => {
        if (err) {
          console.log(err);
          ingestorRes = {error: "500"};
        }
        else {
          const result = [];

          if (data) {
            const { Contents } = data;
            if (Contents.length) {
              var hour_ = hour.substring(0,2);
              Contents
                .forEach(({ Key }) => {
                    const [, hourString] = Key.split("_");
                    const hr = hourString.substring(0, 2);
                    if (hr === hour_) {
                        result.push(Key)
                    }
                })
            }
          }
          ingestorRes = result.slice(0, 4);
          console.log(ingestorRes);

          let stringData = JSON.stringify(ingestorRes);
          channel.sendToQueue(msg.properties.replyTo,
            Buffer.from(stringData), {
              correlationId: msg.properties.correlationId
          });
          console.log("Sent this back:", stringData);
          channel.ack(msg);
        }
      })
    });
  });
});

