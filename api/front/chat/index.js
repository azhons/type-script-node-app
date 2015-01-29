var express = require('express');
var sockets = require('socket.io');
var redisAdapter = require('socket.io-redis');
function onNewSocket(socket) {
    console.log('connected');
    var i = 1;
    var interval = setInterval(function () {
        var message = "message " + socket.id + ":" + (i++);
        console.log(message);
        socket.emit('news', { text: message });
    }, 1000);
    socket.on('disconnect', function () {
        clearInterval(interval);
        console.log('Disconnected');
    });
}
function init(server) {
    var io = sockets.listen(server);
    io.adapter(redisAdapter());
    io.on('connection', onNewSocket);
    var app = express();
    return app;
}
module.exports = init;
//# sourceMappingURL=index.js.map