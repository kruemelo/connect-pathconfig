var assert = require('assert');
var request = require('request');
var PathConfig = require('../app.js');
var pc = PathConfig();

describe('config path', function () {

	it('should instanciate with a default config', function () {
		assert.strictEqual(typeof PathConfig(), 'function');
	});

	it('should get path config', function () {
		pc = PathConfig();
		assert.deepEqual(pc.getPathConfig(), {});
	});

	it('should get path config for current req path', function () {
		
		pc = PathConfig({
			'': {x: 1, y: 0},	// root config
			'a': {			// path /a
				'': {x: 'a'},	// config /a
				'b': {		// path /a/b
					'': {x: 'a.b'} // config /a/b
				},
				':y': {		// path /a/?
					'c': {	// path /a/?/c
						'': {x: 'a.:y.c'}	// config a/?/c
					}
				}
			}
		});

		assert.deepEqual(pc.getPathConfig(), {x: 1, y: 0});
		assert.deepEqual(pc.getPathConfig('//'), {x: 1, y: 0});
		assert.deepEqual(pc.getPathConfig('/../'), {x: 1, y: 0});
		assert.deepEqual(pc.getPathConfig('/'), {x: 1, y: 0});
		assert.deepEqual(pc.getPathConfig('/a'), {x: 'a', y: 0});
		assert.deepEqual(pc.getPathConfig('/a/b/'), {x: 'a.b', y: 0});						
		assert.deepEqual(pc.getPathConfig('/a/b'), {x: 'a.b', y: 0});		
		assert.deepEqual(pc.getPathConfig('/a/zzz'), {x: 'a', y: 0});	
		assert.deepEqual(pc.getPathConfig('/a/zzz/c'), {x: 'a.:y.c', y: 0});	
		assert.deepEqual(pc.getPathConfig('/a/zzz/c/..'), {x: 'a.:y.c', y: 0});	

	});

 });

describe('used as connect middleware', function () {

	var connect = require('connect');
	var http = require('http');
	var app = connect();
	var server;

	pc = PathConfig({
		'': {x: 1, y: 0},	// root config
		'a': {			// path /a
			'': {x: 'a'},	// config /a
			'b': {		// path /a/b
				'': {x: 'a.b'} // config /a/b
			},
			':y': {		// path /a/?
				'c': {	// path /a/?/c
					'': {x: 'a.:y.c'}	// config a/?/c
				}
			}
		}
	});

	app.use(pc);

	app.use(function(req, res) {
		var fn = req.getPathConfig;
    res.end(fn && JSON.stringify(fn()) || 'no function getPathConfig()');
	});

	before(function (done) {		
		server = http.createServer(app).listen(3000, 'localhost', null, done);
	});

	it('should be used on request', function (done) {

		[
			{path: '', expected: '{"x":1,"y":0}'},
			{path: '/', expected: '{"x":1,"y":0}'},
			{path: '//', expected: '{"x":1,"y":0}'},
			{path: '/../', expected: '{"x":1,"y":0}'},
			{path: '/a', expected: '{"x":"a","y":0}'},
			{path: '/a/b/', expected: '{"x":"a.b","y":0}'},
			{path: '/a/b', expected: '{"x":"a.b","y":0}'},
			{path: '/a/zzz', expected: '{"x":"a","y":0}'},
			{path: '/a/zzz/c', expected: '{"x":"a.:y.c","y":0}'},
			null
		].forEach(function (test) {
			if (null === test) {
				done();
				return;
			}
			request('http://localhost:3000' + test.path, function (error, response, body) {
				assert.strictEqual(body, test.expected);
			});
		})

	});

	after(function (done) {
		server.close(done); 
	});

});