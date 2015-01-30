/// <reference path="../typings/tsd.d.ts" />

import app = require('../config');
import io = require('socket.io-client');
import schemas = require('../global-schemas');

angular.module(app.name).factory(app.srv.chat, getChatService);

getChatService.$inject = [];

var socket = io('http://localhost:8085');

function getChatService() {
    return new ChatService();
}

class ChatService implements IChatService
{
    listen(handler: (message: schemas.ChatMessage) => void) {
        socket.on('news', function (data) {
            handler(data);
        });

        socket.on('reconnect', function () {
            console.log('reconnected');
        })
    }
}

interface IChatService
{
    listen(handler: (message: schemas.ChatMessage)=>void ): void;
}

export = IChatService;