var express = require('express');
var router = express.Router();
var request = require('request');

/* GET users listing. */


// router.get('/status', (req, res) => {
//     console.log('This just called', req.body);
//     api_helper.registry_call('http://localhost:8091/registry/status')
//     .then(response => {
//         res.json(response)
//     })
//     .catch(error => {
//         res.send(error)
//     })
// })

// router.get('/status', function(req, res, next) {
//   res.send('respond with a resource',path);
// });

// router.post('/', function(req, res, next) {
//     res.send('post with a resource');
// });

module.exports = router;
