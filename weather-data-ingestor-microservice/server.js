
const express = require('express')
const routes = require('./api/routes');


 //init express
 const app = express()
 const port = 3001
 app.use(express.json());
 
//  routes(app);

 app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
}) 


// amqplib is a protocol for  messaging . So use that 
var amqp = require('amqplib/callback_api');
//connect to the rabitmq server

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
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

// function fibonacci(n) {
//   if (n == 0 || n == 1)
//     return n;
//   else
//     return fibonacci(n - 1) + fibonacci(n - 2);
// }