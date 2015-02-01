var redis = require('redis');
var ChatService = (function () {
    function ChatService(store) {
        store.incr(null, null);
    }
    ChatService.prototype.exec = function () {
        redis.createClient();
    };
    ChatService.prototype.addMessage = function (message) {
        this.exec();
    };
    return ChatService;
})();
exports.Service = ChatService;
//# sourceMappingURL=chatService.js.map