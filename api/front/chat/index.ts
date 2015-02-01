/// <reference path="../../typings/tsd.d.ts" />
import express = require('express');
import schemas = require('../../global-schemas');
import chatService = require('../../domain/chat-service');
import routes = require('./routes');

function write(socket, message: schemas.ChatMessage)
{
    socket.emit('news', message);
}

function onNewSocket(socket: Socket)
{
    console.log('connected');

    console.log(socket.client.request.decoded_token);

    socket.on('disconnect', function () {
        console.log('Disconnected');
    });
}

export function init(
    socketServer: SocketServer,
    serviceFactory: (context: chatService.ChatContext) => chatService.ChatService) {

    socketServer.on('connection', onNewSocket);

    var app = express();
    app.use('/', routes);

    return app;
}

interface Socket {
    emit(name: string, ...args: any[]): Socket;
    on(event: string, listener: Function): any;
    disconnect(close: boolean): Socket;
    handshake: any;
    client: any;
}

interface SocketServer {
    on(event: 'connection', listener: (socket: Socket) => void): any;
    on(event: string, listener: Function): any;
}