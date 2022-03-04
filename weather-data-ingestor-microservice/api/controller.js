const AWS = require('aws-sdk');

 //init AWS S3 Bucket
 var S3 = new AWS.S3({ region: 'us-east-1' });

 var BucketConfig = {
     Bucket: 'noaa-nexrad-level2',
     Delimiter: '/',
 };

 const fib = (n)=> {
        if (n == 0 || n == 1)
            return n;
        else
            return fib(n - 1) + fib(n - 2);
 }

//  var controllers = {
//      postS3url: function(req, res) {
//          const { body } = req;
//          console.log("body=",req.body)
//          const { date, time:hour, datacenter:radar } = body;
//          const [year, month, day] = date.split("-")

//          BucketConfig.Prefix = `${year}/${month}/${day}/${radar}/`;

//          S3.makeUnauthenticatedRequest('listObjects', BucketConfig, (err, data) => {
//              if (err) {
//                  res.status(500).send();
//              }
//              else {
//                  const result = [];

//                  if (data) {
//                      const { Contents } = data;
//                      if (Contents.length) {
//                          var hour_ = hour.substring(0,2);
//                          Contents
//                              .forEach(({ Key }) => {
//                                  const [, hourString] = Key.split("_");
//                                  const hr = hourString.substring(0, 2);
//                                  if (hr === hour_) {
//                                      result.push(Key)
//                                  }
//                              })
//                      }
//                  }
//                  console.log(result)
//                  return res.json(result.slice(0, 4))
//                  res.json(result.slice(0, 4))
//              }
//          })
//     },
//  };
module.exports.fib = fib

 var controllers = {
     postS3url: function(req, res) {
         const { body } = req;
         console.log("body=",req.body)
         const { date, time:hour, datacenter:radar } = body;
         const [year, month, day] = date.split("-")

         BucketConfig.Prefix = `${year}/${month}/${day}/${radar}/`;

         S3.makeUnauthenticatedRequest('listObjects', BucketConfig, (err, data) => {
             if (err) {
                 res.status(500).send();
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
                 console.log(result)
                 return res.json(result.slice(0, 4))
                 res.json(result.slice(0, 4))
             }
         })
    },
 };