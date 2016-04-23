/* jshint node: true */

var http = require('http');
var https = require('https');
var domain = require('domain');
var url = require('url');

function proxy(scheme, hostName, port, method, pathWithQueryParams, headers) {
    var options = {
        hostname: hostName,
        port: port,
        path: pathWithQueryParams,
        method: method,
        agent: false,
        headers: headers,
        rejectUnauthorized: false
    };
    
    var request;

    if (scheme === 'https') {
        request = https.request(options);
    } else {
        request = http.request(options);
    }

    return request;
}

module.exports = function(config) {
    return function(req, res) {
        var pathWithQueryParams = req.url;

        var headers = {};
        for (var header in req.headers) {
            if (req.headers.hasOwnProperty(header)) {
                headers[header] = req.headers[header];
            }
        }

        var requestToServer = proxy(
            'http',
            config.remoteHost,
            config.remotePort,
            req.method,
            pathWithQueryParams,
            headers
        );

        requestToServer.setNoDelay();

        requestToServer.on('error', function(err) {
            res.socket.close(res.socket.destroy.bind(res.socket));
        });

        requestToServer.on('response', requestCompleted);

        if (req.method === 'PUT' || req.method === 'POST') {
            req.pipe(requestToServer);
        } else {
            requestToServer.end();
        }

        function requestCompleted(responseFromServer) {
            res.writeHead(responseFromServer.statusCode, responseFromServer.statusMessage, responseFromServer.headers);
            responseFromServer.pipe(res);
        }
    };
};
