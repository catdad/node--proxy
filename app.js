var http = require("http");
var httpProxy = require("http-proxy");
var logger = require("./logger.js");

var listenPort = 8888;

var remoteHost = '127.0.0.1';
var remotePort = 80;

// Create a proxy server with custom application logic
httpProxy.createServer(function (req, res, proxy) {
	logger.log(logger.ip(req), logger.url(req));
  
	//proxy config
	proxy.proxyRequest(req, res, {
		host: remoteHost,
		port: remotePort
	});
}).listen(listenPort);

console.log("proxy on " + listenPort);
