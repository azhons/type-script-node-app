/// <reference path="../../typings/tsd.d.ts" />
var assert = require('assert');
var chatService = require('../chat-service');
var factory = require('../../factory');
var Promise = require('bluebird');
describe("Test Suite 1", function () {
    function saveMessage(service) {
        var time = new Date();
        time.setDate(time.getDate() + 1);
        return service.addMessage({
            author: 11,
            text: "long test message {a}",
            time: time.getTime()
        });
    }
    it("Test A", function (done) {
        var redisClient = factory.createRedisClient();
        var context = new chatService.ChatContext([22, 11, 1000]);
        var service = new chatService.ChatService(redisClient, context);
        var cleanupKeys = ["11:22:1000M", "11:22:1000C"];
        Promise.all(cleanupKeys.map(function (k) { return redisClient.delAsync(k); })).then(function () {
            return Promise.all([
                saveMessage(service),
                saveMessage(service),
                saveMessage(service)
            ]);
        }).then(function () {
            return service.readMessagesAfter(2);
        }).then(function (messages) {
            assert.equal(messages.length, 1, "expected 1 message after index 2");
            assert.equal(messages[0].counter, 3);
            done();
        }).catch(function (e) { return done(e); });
    });
});
//# sourceMappingURL=chat-service-tests.js.map