const controller = require('./controller');

 module.exports = function(app) {
     app.route('/api/uri/images/')
         .post(controller.fibonacci);
         
  }; 