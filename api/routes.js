const controllers = require('./controllers');


module.exports = function(app, wss) {

    app.get('/', controllers.Home.index);
    app.get('/publish', controllers.Home.create);
    app.get('/watch/:id', controllers.Home.watch);

    app.post('/api/upload', controllers.Image.create);
    app.get('/api/images/:id', controllers.Image.get);
    app.patch('/api/images/:id/preset/:preset', controllers.Image.update);

    controllers.setWebsocketServer(wss);
    wss.on('connection', controllers.Image.stream);

};
