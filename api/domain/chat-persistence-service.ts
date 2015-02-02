/// <reference path="../typings/all.ts" />
import schemas = require('../global-schemas');
import Promise = require('bluebird');

var keys = { messages: "M", counter: "C", notification: "__keyspace@0__:" };

export class Service implements IService
{
    private newsHandler: Function;
    private subscriber: Subscriber;

    constructor(
        private store: Store,
        private subscriberFactory: () => Subscriber,
        private context: Context)
    {
    }

    listenForNews(handler: Function)
    {
        this.newsHandler = handler;
        !this.subscriber && this.connectSubscriber();
    }

    addMessage(message: schemas.ChatMessage): Promise<number>
    {
        var time = (new Date()).getTime();

        return this.store.incrAsync(this.getCounterKey()).then(counter => {
            var savedMessage: SavedMessage = {
                i: counter,
                a: message.author,
                m: message.text,
                t: time
            };

            return this.store.zaddAsync(this.getMessagesKey(), counter, JSON.stringify(savedMessage))
                .then(() => counter);
        });
    }

    readMessagesAfter(counter: number): Promise<schemas.ChatMessage[]>
    {
        var messagesKey = this.context.getKey() + keys.messages;
        var min = "" + counter;
        var max = "+inf";

        return this.store.zrevrangebyscoreAsync(messagesKey, max, min).then(results => {
            return results.map(v => {
                var m = <SavedMessage>JSON.parse(v);

                return <schemas.ChatMessage>{
                    author: m.a,
                    counter: m.i,
                    text: m.m,
                    time: m.t
                };
            })
        }).then(results => {
            if (results.length && results[results.length - 1].counter === counter)
            {
                // we got everything we need from cache, otherwise we need to go to permanent store
                results.splice(results.length - 1, 1);
            }

            return results;
        });
    }

    private getMessagesKey() { return this.context.getKey() + keys.messages; }

    private getCounterKey() { return this.context.getKey() + keys.counter; }

    private connectSubscriber()
    {
        this.subscriber = this.subscriberFactory();

        this.subscriber.on("message", () => {
            this.newsHandler && this.newsHandler();
        });

        this.subscriber.on("connect", () => {
            this.subscriber.subscribe(keys.notification + this.getMessagesKey());
            this.newsHandler && this.newsHandler();
        });

        this.subscriber.on('error', () => {
            this.subscriber.end();
            this.connectSubscriber();
        });
    }
}

export interface IService {
    listenForNews(handler: Function);
    addMessage(message: schemas.ChatMessage): Promise<number>;
    readMessagesAfter(counter: number): Promise<schemas.ChatMessage[]>;
}

export interface Store {
    incrAsync(key: string): Promise<number>;
    zaddAsync(key: string, score: number, value: string): Promise<number>;
    zrevrangebyscoreAsync(key: string, max: string, min: string): Promise<string[]>;
}

export interface Subscriber
{
    subscribe(channel: string);
    on(event: string, listener: Function);
    end();
}

export class Context
{
    private key: string

    constructor(users: number[])
    {
        this.key = users.sort((a, b) => a - b).join(":");
    }

    getKey() { return this.key; }
}

export function createChatService(
    client: Store,
    subscriberFactory: () => Subscriber, context: Context)
{
    return new Service(client, subscriberFactory, context);
}

interface SavedMessage {
    // id
    i: number;
    // message
    m: string;
    // time
    t: number;
    // author
    a: number;
}