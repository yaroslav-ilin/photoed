const controllers = require('./controllers');


module.exports = function(app) {

    app.get('/', controllers.Home.index);
    app.post('/api/upload', controllers.Image.create);

};
