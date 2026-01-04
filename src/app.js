const express = require('express');
const routes = require('./routes');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

<<<<<<< HEAD
app.use('/', express.static(path.join(__dirname, '../../designplus-web-fullstack/public')));
=======

app.use('/', express.static(path.join(__dirname, '../../designplus-web/public')));
>>>>>>> a9e7bec5c396c17d1999df31a87c53b8a3769f58
app.use('/v1/api', routes);

module.exports = app;
