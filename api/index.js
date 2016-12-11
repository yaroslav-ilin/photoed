const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const multer  = require('multer');

const routes = require('./routes');


const server = require('http').createServer();
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server: server });
const app = express();

app.use(bodyParser.json());
app.use(multer({ dest: path.join(path.dirname(__dirname), 'uploads') }).single('image'));

app.use('/ui', express.static(path.join(path.dirname(__dirname), 'ui')));
app.use('/vendor', express.static(path.join(path.dirname(__dirname), 'node_modules')));
app.use('/uploads', express.static(path.join(path.dirname(__dirname), 'uploads')));

routes(app, wss);
server.on('request', app);

module.exports = server;
