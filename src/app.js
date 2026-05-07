const express = require('express');
const routes = require('./routes');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', express.static(path.join(__dirname, '../../designplus-web-fullstack/public')));
<<<<<<< Updated upstream
app.use('/v2/api', routes);
=======
app.use('/v1/api', routes);
>>>>>>> Stashed changes

module.exports = app;
