connect-pathconfig
==================

connect/express middleware that provides url path-related configurations for requests

.h1 install
$ npm install connect-pathconfig

test
$ mocha

use
var connect = require('connect')
var pathconfig = require('connect-pathconfig');
var app = connect();

var config = {
  '': {bla: 'elk', dog: 'barks'},
  pp1: {
    '': {bla: 'geweih', cat: 'meauws'}
  }
};

app.use(pathconfig(config));

app.use(function (req, res) {
  console.log(req.getPathConfig());
});
