/// <reference path="../typings/all.ts" />
var chatPersistence = require('./chat-persistence-service');
var factory = {
    createChatService: function (client, subscriberFactory, context) {
        return new chatPersistence.Service(client, subscriberFactory, context);
    }
};
module.exports = factory;
//# sourceMappingURL=factory.js.map