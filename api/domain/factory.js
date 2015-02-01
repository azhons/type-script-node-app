/// <reference path="../typings/all.ts" />
var chatService = require('./chat-service');
var factory = {
    createChatService: function (client, context) {
        return new chatService.ChatService(client, context);
    }
};
module.exports = factory;
//# sourceMappingURL=factory.js.map