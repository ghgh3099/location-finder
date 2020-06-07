const path = require('path');
// init app
const express = require('express');
const app = express();

// init database
require('./config/mongoose');

// enable CORS - Cross Origin Resource Sharing
const cors = require('cors');
app.use(cors());

// use body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// front-end route
const FRONT_END_DIR = "../public/dist/";
app.use(express.static(path.join(__dirname, FRONT_END_DIR)))
app.use(/^((?!(api)).)*/, (req, res) => {
  res.sendFile(path.join(__dirname, FRONT_END_DIR + 'index.html'));
});

// API router
const routes = require('./routes');
app.use('/api/', routes);

app.get('/', function (req, res) {
  res.send('Hello World\n');
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {

  // customize Joi validation errors
  if (err.isJoi) {
    err.message = err.details.map(e => e.message).join("; ");
    err.status = 400;
  }

  res.status(err.status || 500).json({
    message: err.message
  });
  next(err);
});

module.exports = app;
