
// the middleware function
module.exports = function (config) {

	function getPathConfig (path) {

		var pathConfig = config[''] || {},
			tmpPathNode = config;

		path = 'string' === typeof path && path.trim() || '/';

		if ('/' !== path[0]) {
			path = '/' +  path;
		}

		path.split('/').forEach(function (pathPart) {
			if (tmpPathNode) {		
				if (pathPart = pathPart.trim()) {
					if (!tmpPathNode[pathPart]) {	
						for (var k in tmpPathNode) {
							if (k && ':' === k[0]) {
								pathPart = k; 
								break;
							}
						}				
					}
					if (tmpPathNode = tmpPathNode[pathPart]) {
						for (var k in tmpPathNode['']) {
							if (k) {
								pathConfig[k] = tmpPathNode[''][k];
							}
						}
					}
				}
			}
		});

		return pathConfig;
	};    

	config = config || {};
  
	var requestHandler = function (req, res, next) {
		req.getPathConfig = function () {
			return getPathConfig(req.url);
		};
	  next();
	};

	requestHandler.getPathConfig = getPathConfig;

  return requestHandler;
    
};