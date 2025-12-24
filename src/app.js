const express = require('express');
const routes = require('./routes');

const app = express();
app.use(express.json());

app.use('/v1/api', routes);

module.exports = app;
