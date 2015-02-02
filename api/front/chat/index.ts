/// <reference path="../../typings/all.ts" />

import express = require('express');
import schemas = require('../../global-schemas');
import persistence = require('../../domain/chat-persistence-service');
import socket = require('../../domain/chat-socket-service');
import routes = require('./routes');

export function init(
    socketServer: socket.SocketServer,
    serviceFactory: (context: persistence.Context) => persistence.Service)
{
    socketServer.on('connection', socket.onNewSocket.bind(null, serviceFactory));

    var app = express();
    app.use('/', routes);

    return app;
}