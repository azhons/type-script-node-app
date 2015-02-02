/// <reference path="../typings/all.ts" />
import chatPersistence = require('./chat-persistence-service');
import redis = require('redis');

var factory = {
    createChatService: chatPersistence.createChatService
};

export = factory;