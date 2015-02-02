/// <reference path="../../typings/all.ts" />
var express = require('express');
var socket = require('../../domain/chat-socket-service');
var routes = require('./routes');
function init(socketServer, serviceFactory) {
    socketServer.on('connection', socket.onNewSocket.bind(null, serviceFactory));
    var app = express();
    app.use('/', routes);
    return app;
}
exports.init = init;
//# sourceMappingURL=index.js.map