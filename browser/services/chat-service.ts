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
    private user: string;
    private connected: boolean = false;
    private socket: SocketIOClient.Socket;
    private chatContext: schemas.ClientChatContext;

    constructor(private $http: ng.IHttpService)
    {
    }

    listen(token: string, handler: (messages: schemas.ChatMessage[]) => void) {
        if (this.socket)
        {
            return;
        }

        this.socket = io.connect('http://localhost:8085', {
            query: 'token=' + token
        });

        this.socket.on('error', () => {
            this.connected = false;
        });

        this.socket.on('news', (data: schemas.ChatMessage[])  => {            
            handler(data);
            data && data.length && (this.chatContext.lastReadCounter = data[0].counter);
        });

        this.socket.on('connect', () => {            
            this.connected = true;
            this.connectToChat();            
        });

        this.socket.on('disconnect', () => {
            this.connected = false;
        });
    }

    chooseChat(context: schemas.ClientChatContext)
    {
        this.chatContext = context;
        this.connectToChat();
    }

    login(user: string): ng.IHttpPromise<{ token: string }>
    {
        this.user = user;
        return this.$http.post<{ token: string }>("http://localhost:8085/chat/auth", {id: user});
    }

    sendMessage(messageText: string)
    {
        var m: schemas.ChatMessage = { text: messageText };
        this.socket.emit('add-message', m);
    }

    private connectToChat()
    {
        this.chatContext && this.connected && this.socket.emit('choose-chat', this.chatContext);
    }
}

interface IChatService
{
    listen(token: string, handler: (messages: schemas.ChatMessage[]) => void): void;
    login(user: string): ng.IHttpPromise<{ token: string }>;
    sendMessage(messageText: string);
    chooseChat(context: schemas.ClientChatContext);
}

export = IChatService;