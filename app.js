/* jshint node: true */

var http = require('http');

var proxyList = require('./config.json');
var proxy = require('./proxy');
var logger = require('./logger');

proxyList.forEach(function(config) {
    var thisProxy = proxy(config);
    
    http.createServer(function(req, res) {
        logger.red().log(
            logger.ip(req) + ' -> ' + config.remoteHost,
            req.method,
            logger.url(req)
        );

        thisProxy(req, res, console.log.bind(console));
    }).listen(config.localPort).on('listening', function() {
        
        logger.magenta().log(
            'local port',
            config.localPort,
            'sending to',
            config.remoteHost + ':' + config.remotePort);
    });

});

