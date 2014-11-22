connect-pathconfig
==================

Node packaged module for connect/express middleware that provides url path-related configurations on requests

install
-------

add to an existing connect/express project: install from command line
```
$ cd PROJECT-NAME
$ npm install connect-pathconfig --save
```

test
----
uses mocha test
```
$ mocha
```

use
---
within a node connect or express project, use as middleware:
```
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
```
