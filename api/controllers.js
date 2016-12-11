const path = require('path');
const fs = require('fs');
const url = require('url');

const models = require('./models');

const DESTINATION = path.join(path.dirname(__dirname), 'uploads');

let websocketServer = null;

function respondWithErrors(res, err) {
    res.status(400).send({
        succes: false,
        code: err.name,
        message: err.message,
        errors: Object.keys(err.errors).reduce((rv, key) => {
            const item = err.errors[key];
            rv.push({
                code: item.name + '.' + item.path,
                message: item.message
            });
            return rv;
        }, [])
    });
}

const Home = {
    index: (req, res) => res.redirect('/publish'),
    create: (req, res) => res.sendFile('ui/index.html', { root: path.dirname(__dirname) }),
    watch: (req, res) => res.sendFile('ui/index.html', { root: path.dirname(__dirname) })
};

const Watch = {
    notify: function(id, data) {
        if (!websocketServer) {
            console.warn('Could not broadcast: no Websocket Server.');
            return;
        }

        console.log('Watch:notify', id, data);
        websocketServer.clients.forEach(function each(ws) {
            const location = url.parse(ws.upgradeReq.url, true);
            if (location.query.watch === id) {
                ws.send(JSON.stringify({ type: 'preset', data }));
            }
        });
    }
};

const Image = {

    create: function(req, res) {
        console.log(req.file);
        const params = Object.assign({}, req.file, {
            filename: req.file.originalname,
            filter: {
                type: 'preset',
                presetId: 'normal'
            }
        });
        const model = new models.Upload(params);
        const err = model.validateSync();
        if (err) {
            respondWithErrors(res, err);
            fs.unlink(req.file.path, (err) => {});
            return;
        }

        model.save().then(function(upload) {
            fs.rename(req.file.path, path.join(DESTINATION, upload._id + upload.extension), function(err) {
                if (err) {
                    console.error(err);
                    res.status(500).send({
                        succes: false,
                        code: 'InternalError',
                        _profile: err
                    });
                } else {
                    res.send({ succes: true, upload_id: upload._id, _profile: upload.toJSON() });
                }
            });
        }, function(err) {
            console.error(err);
            respondWithErrors(res, err);
            fs.unlink(req.file.path, (err) => {});
        });
    },

    get: function(req, res) {
        models.Upload.findById(req.params.id).then(function(model) {
            if (!model) {
                return Promise.reject(new Error('Upload is Null'));
            }

            res.send({
                _profile: model.toJSON(),
                id: model.id,
                extension: model.extension,
                url: '/uploads/' + model.id + model.extension,
                filter: model.filter,
                mimetype: model.mimetype
            });
        }).catch(function(err) {
            console.error(err);
            res.status(404).send({
                _profile: { message: err.message },
                code: 'NotFound',
                message: 'Not found image'
            });
        });
    },

    update: function(req, res) {
        models.Upload.setPresetId(req.params.id, req.params.preset)
            .then(function(model) {
                if (!model) {
                    return Promise.reject(new Error('Upload is Null'));
                }

                res.send({
                    _profile: model.toJSON(),
                    succes: true,
                    filter: model.filter
                });

                Watch.notify(model.id, model.filter);
            })
            .catch(function(err) {
                console.error(err);
                if (err.errors && err.errors['filter.presetId']) {
                    respondWithErrors(res, err);
                } else {
                    res.status(404).send({
                        _profile: { message: err.message },
                        code: 'NotFound',
                        message: 'Not found image'
                    });
                }
            });
    },

    stream: function(ws) {
        const location = url.parse(ws.upgradeReq.url, true);

        if (!location.query.watch) {
            ws.close();
            return;
        }

        models.Upload.findById(location.query.watch)
            .then(function(model) {
                ws.send(JSON.stringify({ type: 'preset', data: model.filter }));
            })
            .catch(function(err) {
                ws.close();
            });

        ws.on('message', function incoming(message) {
            console.log('websocket received: %s', message);
        });
    }

};

module.exports = {
    setWebsocketServer: function(wss) {
        websocketServer = wss;
    },

    Home,
    Image
};
