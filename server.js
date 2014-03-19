var static = require('node-static');
var file = new static.Server('./public');
var temp;

var server = require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    }).resume();
}).listen(8080);

exports.server = server
