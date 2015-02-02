/// <reference path="../typings/all.ts" />
var chatPersistence = require('./chat-persistence-service');
var factory = {
    createChatService: chatPersistence.createChatService
};
module.exports = factory;
//# sourceMappingURL=factory.js.map