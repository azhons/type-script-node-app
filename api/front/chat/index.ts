import express = require('express');
import sockets = require('socket.io');
import http = require('http');
var redisAdapter = require('socket.io-redis');

function onNewSocket(socket: any)
{
    console.log('connected');
    var i = 1;

    var interval = setInterval(() => {
        var message = "message " + socket.id + ":" + (i++);
        console.log(message);
        socket.emit('news', { text: message });
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