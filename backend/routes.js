const path = require('path');
const fs = require('fs');

const api = require('./api');


module.exports = function(app) {

    app.get('/', function(req, res) {
        res.sendFile('frontend/index.html', { root: path.dirname(__dirname) });
    });

    app.post('/api/upload', function(req, res) {
        api.saveImage(req.file).then(function(imageName) {
            res.send({ succes: true, imageName });
        }, function(err) {
            res.status(500).send({ succes: false, error: { message: err.message } });
            fs.unlink(req.file.path, (err) => {});
        });
    });

};
