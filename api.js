// parsing urls
var http = require('http');
var url = require('url');

//TODO: Hay que cambiar el puero de atención para que se pueda parametrizar

var server = http.createServer(function(req, res) {
    var i = 0;
    var t = req.url.split("/");

    for (i = 0; i < t.length; i++) {
        console.log('t', i, ': ', t[i]);
    }
    res.end('OK');
});

server.listen(4000);