var keys = { messages: "M", counter: "C" };
var ChatService = (function () {
    function ChatService(store, context) {
        this.store = store;
        this.context = context;
    }
    ChatService.prototype.addMessage = function (message) {
        var _this = this;
        var messagesKey = this.context.getKey() + keys.messages;
        var counterKey = this.context.getKey() + keys.counter;
        var time = (new Date()).getTime();
        return this.store.incrAsync(counterKey).then(function (counter) {
            var savedMessage = {
                i: counter,
                a: message.author,
                m: message.text,
                t: time
            };
            return _this.store.zaddAsync(messagesKey, counter, JSON.stringify(savedMessage)).then(function () { return counter; });
        });
    };
    ChatService.prototype.readMessagesAfter = function (counter) {
        var messagesKey = this.context.getKey() + keys.messages;
        var min = "(" + counter;
        var max = "+inf";
        return this.store.zrevrangebyscoreAsync(messagesKey, max, min).then(function (results) {
            return results.map(function (v) {
                var m = JSON.parse(v);
                return {
                    author: m.a,
                    counter: m.i,
                    text: m.m,
                    time: m.t
                };
            });
        });
    };
    return ChatService;
})();
exports.ChatService = ChatService;
var ChatContext = (function () {
    function ChatContext(users) {
        this.key = users.sort(function (a, b) { return a - b; }).join(":");
    }
    ChatContext.prototype.getKey = function () {
        return this.key;
    };
    return ChatContext;
})();
exports.ChatContext = ChatContext;
//# sourceMappingURL=chat-service.js.map