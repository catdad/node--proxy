/* jshint node: true */

var http = require("http");
var httpProxy = require("http-proxy");
var logger = require("./logger.js");

var proxyList = require('./config.json');

function registerProxy(localPort, remoteHost, remotePort) {
	// Create a proxy server with custom application logic
	httpProxy.createServer(function (req, res, proxy) {
		logger.log(logger.ip(req) + ' -> ' + remoteHost, req.method, logger.url(req));
		
		//proxy config
		proxy.proxyRequest(req, res, {
			host: remoteHost,
			port: remotePort
		});
	}).listen(localPort);

	logger.log('local port', localPort, 'sending to', remoteHost + ':' + remotePort);
}

proxyList.forEach(function(opts){
	registerProxy(opts.localPort, opts.remoteHost, opts.remotePort);
});
