const AWS = require('aws-sdk');

 //init AWS S3 Bucket
 var S3 = new AWS.S3({ region: 'us-east-1' });

 var BucketConfig = {
     Bucket: 'noaa-nexrad-level2',
     Delimiter: '/',
 };


 var controllers = {
     getS3url: function(req, res) {
         const { params } = req;
         const { year, month, day, hour, radar } = params;

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
                         Contents
                             .forEach(({ Key }) => {
                                 const [, hourString] = Key.split("_");
                                 const hr = hourString.substring(0, 2);
                                 if (hr === hour) {
                                     result.push(Key.split("/")[4])
                                 }
                             })
                     }
                 }
                 res.json(result.slice(0, 4))
             }
         })
    },
 };

 module.exports = controllers; 