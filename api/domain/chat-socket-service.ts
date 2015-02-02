/// <reference path="../typings/all.ts" />
import schemas = require('../global-schemas');
import persistence = require('./chat-persistence-service');
import P = require('bluebird');

export class Service
{
    private persistService: persistence.IService;
    private persistContext: persistence.Context;

    private reading = false;
    private newsAvailable = true;
    private connected = false;

    private latestRead: number;

    constructor(
        private serviceFactory: (context: persistence.Context) => persistence.IService,
        private socket: Socket)
    {
        this.listenOnSocket();
    }

    private listenOnSocket()
    {
        this.socket.on('disconnect', () => this.connected = false);
        this.socket.on('choose-chat', this.onChooseChat.bind(this));
        this.socket.on('add-message', this.onAddMessage.bind(this));
    }

    private onChooseChat(data: schemas.ClientChatContext)
    {
        this.connected = true;

        var users = [data.otherUserId, this.socket.client.request.decoded_token.id];
        this.persistContext = new persistence.Context(users);
        this.latestRead = data.lastReadCounter || 0;

        this.persistService = this.serviceFactory(this.persistContext);

        this.persistService.listenForNews(this.onNews.bind(this));
    }

    private onNews() {
        this.newsAvailable = true;
        !this.reading && this.connected && this.readNext();
    }

    private onAddMessage(data: schemas.ChatMessage) {
        data.author = this.socket.client.request.decoded_token.id;
        this.persistService.addMessage(data).error(e => {
            // TODO: notify message could not be persisted
        });
    }

    private readNext() {
        this.newsAvailable = false;
        this.reading = true;

        this.persistService.readMessagesAfter(this.latestRead)
            .then(messages => {
                if (this.connected) {
                    this.socket.emit('news', messages);
                    messages && messages.length && (this.latestRead = messages[0].counter);
                    this.newsAvailable && this.readNext();
                }
            })
            .error(e => {
                // TODO: notify
            })
            .finally(() => { this.reading = false; });
    }
}

export function onNewSocket(
    serviceFactory: (context: persistence.Context) => persistence.IService,
    socket: Socket) {
    new Service(serviceFactory, socket);
}

export interface Socket {
    emit(name: string, ...args: any[]): any;
    on(event: string, listener: Function): any;
    client: any;
}

export interface SocketServer {
    on(event: 'connection', listener: (socket: Socket) => void): any;
    on(event: string, listener: Function): any;
}