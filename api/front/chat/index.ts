/// <reference path="../../typings/tsd.d.ts" />

import express = require('express');
import sockets = require('socket.io');
import http = require('http');
import schemas = require('../../global-schemas');

var redisAdapter = require('socket.io-redis');

function write(socket, message: schemas.ChatMessage)
{
    socket.emit('news', message);
}

function onNewSocket(socket: any)
{
    console.log('connected');
    var i = 1;

    var interval = setInterval(() => {
        var message = "message " + socket.id + ":" + (i++);
        console.log(message);

        write(socket, { text: message, time: (new Date()).getTime() });
    }, 1000);

    socket.on('disconnect', function () {
        clearInterval(interval);
        console.log('Disconnected');
    });
}

function init(server: http.Server) {
    var io = sockets.listen(server);

    io.adapter(redisAdapter());

    io.on('connection', onNewSocket);

    var app = express();

    return app;
}

export = init;