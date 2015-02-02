/// <reference path="../../typings/all.ts" />
import assert = require('assert');
import redis = require('redis');
import persistence = require('../chat-persistence-service');
import sockets = require('../chat-socket-service');
import factory = require('../../factory');
import Promise = require('bluebird');
import Lazy = require('lazy.js');
import env = require('../../env');
import schemas = require('../../global-schemas');

describe("Sending chat messages",() => {

    before(() => {
        var settings = {
            redisHost: null,
            redisPort: null
        };

        global.settings = settings;
    });

    function saveMessage(service: persistence.Service): Promise<number>
    {
        var time = new Date();
        time.setDate(time.getDate() + 1);

        return service.addMessage({
            author: 11,
            text: "long test message {a}",
            time: time.getTime()
        });
    }

    function stubSocket(): sockets.Socket
    {
        var socket: sockets.Socket = {
            client: {
                request: {
                    decoded_token: {
                        id: 1
                    }
                }
            },
            on: (e: string, listener: Function) =>
            {
            },
            emit: (channel: string, ...args: any[]) =>
            {
            }
        };

        return socket;
    }

    it("persists and returns messages after specific index", done => {
        var redisClient = factory.createRedisClient();
        var context = new persistence.Context([22, 11, 1000]);
        var service = new persistence.Service(redisClient, factory.createSubscriber, context);

        var cleanupKeys = ["11:22:1000M", "11:22:1000C"];

        Promise.all(cleanupKeys.map(k => redisClient.delAsync(k))).then(() => {
            var saveOperation = saveMessage.bind(null, service);
            return Promise.all(Lazy.generate(saveOperation, 4).toArray());
        }).then(() => {
            return service.readMessagesAfter(2);
        }).then(messages => {
            assert.equal(messages.length, 2, "expected 2 messages after index 2, exclusive, got: " + messages.length);
            assert.equal(messages[0].counter, 4);
            assert.equal(messages[1].counter, 3);

            done();
        }).catch(e=> done(e));
    });

    it("can test socket service", done => {
        function factory(context: persistence.Context) : persistence.IService
        {
            return {
                listenForNews: (handler: Function) => {

                },
                addMessage(message: schemas.ChatMessage): Promise<number> {
                    return Promise.resolve(1);
                },
                readMessagesAfter(counter: number): Promise<schemas.ChatMessage[]> {
                    return Promise.resolve([]);
                }
            };
        }

        var socket = stubSocket();
        var socketService = new sockets.Service(factory, socket);

        done();
    });
});
