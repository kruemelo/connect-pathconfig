// npm connect-pathconfig

var url = require('url');
var path = require('path');

// the middleware function
module.exports = function (config) {

	config = config || {};

	function parse (_path) {

		var pathparts = [];

		_path = 'string' === typeof _path && _path || '/';

		_path.split(/\/+/)
			.forEach(function (term) {
				term = term.trim();
				if (term.length && '.' !== term) {
					if ('..' === term) {
						pathparts.pop();
					}
					else {
						pathparts.push(term);
					}
				}
			});

		return pathparts;
	}

	function getPathConfig (pathname) {

		var pathConfig = {},
			tmpPathNode = config,
			k,
			pathparts, pathpartsLength, 
			level, pathPart;

		// always use root as default
		for (k in config['']) {
			pathConfig[k] = config[''][k];
		}

		pathparts = parse(pathname);

		for (
			level = 0, pathpartsLength = pathparts.length; 
			level < pathpartsLength && tmpPathNode; 
			++level
		) {
			pathPart = pathparts[level];
			if (!tmpPathNode[pathPart]) {	
				for (k in tmpPathNode) {
					if (k && ':' === k[0]) {
						pathPart = k; 
						break;
					}
				}				
			}
			tmpPathNode = tmpPathNode[pathPart];
			if (tmpPathNode && tmpPathNode['']) {
				// extend/override path config
				for (k in tmpPathNode['']) {
					pathConfig[k] = tmpPathNode[''][k];
				}
			}
		}

		return pathConfig;
	}
  
	var requestHandler = function (req, res, next) {
		var originalUrl = req.url;
		req.getPathConfig = function () {
			return getPathConfig(url.parse(originalUrl).pathname);
		};
	  next();
	};

	// expose internal functions
	requestHandler.getPathConfig = getPathConfig;
	requestHandler.parse = parse;

  return requestHandler;
    
};