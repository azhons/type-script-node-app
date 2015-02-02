/// <reference path="../../typings/all.ts" />
var assert = require('assert');
var persistence = require('../chat-persistence-service');
var sockets = require('../chat-socket-service');
var factory = require('../../factory');
var Promise = require('bluebird');
var Lazy = require('lazy.js');
describe("Sending chat messages", function () {
    before(function () {
        var settings = {
            redisHost: null,
            redisPort: null
        };
        global.settings = settings;
    });
    function saveMessage(service) {
        var time = new Date();
        time.setDate(time.getDate() + 1);
        return service.addMessage({
            author: 11,
            text: "long test message {a}",
            time: time.getTime()
        });
    }
    function stubSocket() {
        var socket = {
            client: {
                request: {
                    decoded_token: {
                        id: 1
                    }
                }
            },
            on: function (e, listener) {
            },
            emit: function (channel) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
            }
        };
        return socket;
    }
    it("persists and returns messages after specific index", function (done) {
        var redisClient = factory.createRedisClient();
        var context = new persistence.Context([22, 11, 1000]);
        var service = new persistence.Service(redisClient, factory.createSubscriber, context);
        var cleanupKeys = ["11:22:1000M", "11:22:1000C"];
        Promise.all(cleanupKeys.map(function (k) { return redisClient.delAsync(k); })).then(function () {
            var saveOperation = saveMessage.bind(null, service);
            return Promise.all(Lazy.generate(saveOperation, 4).toArray());
        }).then(function () {
            return service.readMessagesAfter(2);
        }).then(function (messages) {
            assert.equal(messages.length, 2, "expected 2 messages after index 2, exclusive, got: " + messages.length);
            assert.equal(messages[0].counter, 4);
            assert.equal(messages[1].counter, 3);
            done();
        }).catch(function (e) { return done(e); });
    });
    it("can test socket service", function (done) {
        function factory(context) {
            return {
                listenForNews: function (handler) {
                },
                addMessage: function (message) {
                    return Promise.resolve(1);
                },
                readMessagesAfter: function (counter) {
                    return Promise.resolve([]);
                }
            };
        }
        var socket = stubSocket();
        var socketService = new sockets.Service(factory, socket);
        done();
    });
});
//# sourceMappingURL=chat-service-tests.js.map