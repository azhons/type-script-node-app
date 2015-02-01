/// <reference path="../typings/all.ts" />
import chatService = require('./chat-service');
import redis = require('redis');

var factory = {
    createChatService: (client: redis.RedisClient, context: chatService.ChatContext) => {
        return new chatService.ChatService(client, context);
    }
};

export = factory;