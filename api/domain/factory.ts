/// <reference path="../typings/all.ts" />
import chatPersistence = require('./chat-persistence-service');
import redis = require('redis');

var factory = {
    createChatService: (
        client: redis.RedisClient,
        subscriberFactory: () => redis.RedisClient, context: chatPersistence.Context) =>
    {
        return new chatPersistence.Service(client, subscriberFactory, context);
    }
};

export = factory;