const express = require('express');
const routes = require('./routes');
const path = require('path');

const app = express();
app.use(express.json());


app.use('/', express.static(path.join(__dirname, '../../webpro_designplus_laravel/designplus-web/public')));
app.use('/v1/api', routes);

module.exports = app;
