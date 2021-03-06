var keys = { messages: "M", counter: "C", notification: "__keyspace@0__:" };
var ChatService = (function () {
    function ChatService(store, subscriberFactory, context) {
        this.store = store;
        this.subscriberFactory = subscriberFactory;
        this.context = context;
    }
    ChatService.prototype.listenForNews = function (handler) {
        this.newsHandler = handler;
        !this.subscriber && this.connectSubscriber();
    };
    ChatService.prototype.addMessage = function (message) {
        var _this = this;
        var time = (new Date()).getTime();
        return this.store.incrAsync(this.getCounterKey()).then(function (counter) {
            var savedMessage = {
                i: counter,
                a: message.author,
                m: message.text,
                t: time
            };
            return _this.store.zaddAsync(_this.getMessagesKey(), counter, JSON.stringify(savedMessage)).then(function () { return counter; });
        });
    };
    ChatService.prototype.readMessagesAfter = function (counter) {
        var messagesKey = this.context.getKey() + keys.messages;
        var min = "" + counter;
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
        }).then(function (results) {
            if (results.length && results[results.length - 1].counter === counter) {
                // we got everything we need from cache, otherwise we need to go to permanent store
                results.splice(results.length - 1, 1);
            }
            return results;
        });
    };
    ChatService.prototype.getMessagesKey = function () {
        return this.context.getKey() + keys.messages;
    };
    ChatService.prototype.getCounterKey = function () {
        return this.context.getKey() + keys.counter;
    };
    ChatService.prototype.connectSubscriber = function () {
        var _this = this;
        this.subscriber = this.subscriberFactory();
        this.subscriber.on("message", function () {
            _this.newsHandler && _this.newsHandler();
        });
        this.subscriber.on("connect", function () {
            _this.subscriber.subscribe(keys.notification + _this.getMessagesKey());
            _this.newsHandler && _this.newsHandler();
        });
        this.subscriber.on('error', function () {
            _this.subscriber.end();
            _this.connectSubscriber();
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