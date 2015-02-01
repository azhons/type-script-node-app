/// <reference path="../../typings/tsd.d.ts" />
import assert = require('assert');
import redis = require('redis');
import chatService = require('../chat-service');
import factory = require('../../factory');
import Promise = require('bluebird');

describe("Test Suite 1",() => {

    function saveMessage(service: chatService.ChatService): Promise<number>
    {
        var time = new Date();
        time.setDate(time.getDate() + 1);

        return service.addMessage({
            author: 11,
            text: "long test message {a}",
            time: time.getTime()
        });
    }

    it("Test A", (done) => {
        var redisClient = factory.createRedisClient();
        var context = new chatService.ChatContext([22, 11, 1000]);
        var service = new chatService.ChatService(redisClient, context);

        var cleanupKeys = ["11:22:1000M", "11:22:1000C"];

        Promise.all(cleanupKeys.map(k => redisClient.delAsync(k))).then(() => {
            return Promise.all([
                saveMessage(service),
                saveMessage(service),
                saveMessage(service)]);
        }).then(() => {
            return service.readMessagesAfter(2);
        }).then(messages => {
            assert.equal(messages.length, 1, "expected 1 message after index 2");
            assert.equal(messages[0].counter, 3);

            done();
        }).catch(e=> done(e));
    });
});
