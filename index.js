
var httpProxy = require('http-proxy');
require('./lib/rule');

var proxy = httpProxy.createServer({
    // target:{
    //     host:'localhost',
    //     port:8080
    // }
    target:'http://localhost:9005'
});

proxy.listen(8006);

// The error event is emitted if the request to the target fail.
// We do not do any error handling of messages passed between client and proxy,
// and messages passed between proxy and target,
// so it is recommended that you listen on errors and handle them.
proxy.on('error',function(err,req,res){
    res.writeHead(500,{
        'Content-Type':'text/plain'
    });
    res.end('Something went wrong.');
});

// This event is emitted before the data is sent.
// It gives you a chance to alter the proxyReq request object.
// Applies to "web" connections
proxy.on('proxyReq',function(proxyReq,res,res,options){
    for(var key in proxyReq){
        var item = proxyReq[key];
        if(typeof item ==='string'){
            console.log(key,item);
        }
        if(typeof item === 'function'){
            console.log(key);
        }
    }
    var host = proxyReq.getHeader('host');
    if(host === 'm.ke.qq.com' && proxyReq.path === '/'){
        res.writeHead(200,{
            'Content-Type':'text/plain'
        });
        res.end('okok');
    }

    console.log(proxyReq.getHeader('host'));

    console.log('end...');
    // console.log(proxyReq);
    // proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
});

// This event is emitted before the data is sent.
// It gives you a chance to alter the proxyReq request object.
// Applies to "websocket" connections
proxy.on('proxyReqWs',function(proxyReq,res,res,options){
    console.log(222);
    //
});

// This event is emitted if the request to the target got a response.
proxy.on('proxyRes', function (proxyRes, req, res) {
  console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
});

// This event is emitted once the proxy websocket was created and piped into the target websocket.
proxy.on('open', function (proxySocket) {
    console.log('on open.');
    // listen for messages coming FROM the target here
    // proxySocket.on('data', hybiParseAndLogMessage);
});

// This event is emitted once the proxy websocket was closed.
proxy.on('close', function (res, socket, head) {
    // view disconnected websocket connections
    console.log('Client disconnected');
});