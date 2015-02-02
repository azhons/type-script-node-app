/// <reference path="../../typings/all.ts" />
import assert = require('assert');
import redis = require('redis');
import persistence = require('../chat-persistence-service');
import factory = require('../../factory');
import Promise = require('bluebird');
import Lazy = require('lazy.js');

describe("Test Suite 1",() => {

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

    it("Test A", (done) => {
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
});
