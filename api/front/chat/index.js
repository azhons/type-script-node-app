/// <reference path="../../typings/tsd.d.ts" />
var express = require('express');
var routes = require('./routes');
function write(socket, message) {
    socket.emit('news', message);
}
function onNewSocket(socket) {
    console.log('connected');
    console.log(socket.client.request.decoded_token);
    socket.on('disconnect', function () {
        console.log('Disconnected');
    });
}
function init(socketServer, serviceFactory) {
    socketServer.on('connection', onNewSocket);
    var app = express();
    app.use('/', routes);
    return app;
}
exports.init = init;
//# sourceMappingURL=index.js.map