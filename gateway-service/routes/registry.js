var express = require('express');
var router = express.Router();
var axios = require('axios');

router.post('/getAll', function(req, resp, next) {
  console.log('This just called registryGetAll', req.body);
    axios
      .get('http://localhost:8091/registry/getAll')
      .then(res => {
        resp.send(res.data)
      })
});


module.exports = router;
