const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const multer  = require('multer');

const routes = require('./routes');


const app = express();

app.use(bodyParser.json());

app.use(multer({ dest: path.join(path.dirname(__dirname), 'uploads') }).single('image'));

app.use('/frontend', express.static(path.join(path.dirname(__dirname), 'frontend')));

app.use('/vendor', express.static(path.join(path.dirname(__dirname), 'node_modules')));

app.use('/public', express.static(path.join(path.dirname(__dirname), 'public')));

routes(app);

module.exports = app;
