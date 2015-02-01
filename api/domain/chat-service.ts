/// <reference path="../typings/all.ts" />
import schemas = require('../global-schemas');
import P = require('bluebird');
import Lazy = require('lazy.js');

var keys = { messages: "M", counter: "C" };

export class ChatService
{
    constructor(private store: Store, private context: ChatContext)
    {
    }

    addMessage(message: schemas.ChatMessage): P<number>
    {
        var messagesKey = this.context.getKey() + keys.messages;
        var counterKey = this.context.getKey() + keys.counter;
        var time = (new Date()).getTime();

        return this.store.incrAsync(counterKey).then(counter => {
            var savedMessage: SavedMessage = {
                i: counter,
                a: message.author,
                m: message.text,
                t: time
            };

            return this.store.zaddAsync(messagesKey, counter, JSON.stringify(savedMessage))
                .then(() => counter);
        });
    }

    readMessagesAfter(counter: number): P<schemas.ChatMessage[]>
    {
        var messagesKey = this.context.getKey() + keys.messages;
        var min = "(" + counter;
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
        });
    }
}

export interface Store {
    incrAsync(key: string): Promise<number>;
    zaddAsync(key: string, score: number, value: string): Promise<number>;
    zrevrangebyscoreAsync(key: string, max: string, min: string): Promise<string[]>;
}

export class ChatContext
{
    private key: string

    constructor(users: number[])
    {
        this.key = users.sort((a, b) => a - b).join(":");
    }

    getKey() { return this.key; }
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