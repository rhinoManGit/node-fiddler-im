var http = require('http');
var https = require('https');
var request = require('request');
var url = require('url');

var middleware = require('./middleware');
var config = require('./config');

var start = function(options) {
    options = options || {};
    for (var key in options) {
        config[key] = options[key];
    }

    middleware.apply([
        require('./plugins/host'),
        require('./plugins/rule')
    ]);

    http.createServer(function(req, res) {

        // parse url.
        var urlObj = url.parse(req.url);
        for (var key in urlObj) {
            req[key] = urlObj[key];
        }

        // set config for middlewares.
        req.config = config;

        middleware.use(req, res, function() {
            request({
                method: req.method,
                url: req.url,
                headers: req.headers
            })
            .on('error',function(err){
                console.log('error:',err,req.url);
                res.writeHead(500);
                res.end('server error');
            })
            .pipe(res);
        });

    }).listen(config.port);

    console.log('start listen port:',config.port);
};



module.exports = {
    applyMiddleware: middleware.apply,
    start: start
};