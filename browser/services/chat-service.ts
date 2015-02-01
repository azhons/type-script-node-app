/// <reference path="../typings/tsd.d.ts" />

import app = require('../config');
import io = require('socket.io-client');
import schemas = require('../global-schemas');

angular.module(app.name).factory(app.srv.chat, getChatService);

getChatService.$inject = ['$http'];

function getChatService($http: ng.IHttpService) {
    return new ChatService($http);
}

class ChatService implements IChatService
{
    constructor(private $http: ng.IHttpService)
    {
    }

    listen(token: string, handler: (message: schemas.ChatMessage) => void) {

        var socket = io.connect('http://localhost:8085', {
            query: 'token=' + token
        });

        socket.on('error', function (e) {
            console.log("error");
            console.log(arguments);
        });

        socket.on('news', function (data) {
            handler(data);
        });

        socket.on('connect', function () {
            console.log('connect');
            console.log(arguments);
        });

        socket.on('disconnect', function () {
            console.log('disconnect');
            console.log(arguments);
        });

        socket.on('reconnect', function () {
            console.log('reconnected');
        });
    }

    login(user: string): ng.IHttpPromise<{ token: string }>
    {
        return this.$http.post<{ token: string }>("http://localhost:8085/chat/auth", {id: user});
    }
}

interface IChatService
{
    listen(token: string,handler: (message: schemas.ChatMessage) => void): void;
    login(user: string): ng.IHttpPromise<{token: string}>;
}

export = IChatService;