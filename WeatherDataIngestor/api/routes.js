const controller = require('./controller');

module.exports = function(app) {
    app.route('/api/uri/images/:year/:month/:day/:hour/:radar')
        .get(controller.getS3url);
 };