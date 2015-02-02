var keys = { messages: "M", counter: "C", notification: "__keyspace@0__:" };
var Service = (function () {
    function Service(store, subscriberFactory, context) {
        this.store = store;
        this.subscriberFactory = subscriberFactory;
        this.context = context;
    }
    Service.prototype.listenForNews = function (handler) {
        this.newsHandler = handler;
        !this.subscriber && this.connectSubscriber();
    };
    Service.prototype.addMessage = function (message) {
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
    Service.prototype.readMessagesAfter = function (counter) {
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
    Service.prototype.getMessagesKey = function () {
        return this.context.getKey() + keys.messages;
    };
    Service.prototype.getCounterKey = function () {
        return this.context.getKey() + keys.counter;
    };
    Service.prototype.connectSubscriber = function () {
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
    return Service;
})();
exports.Service = Service;
var Context = (function () {
    function Context(users) {
        this.key = users.sort(function (a, b) { return a - b; }).join(":");
    }
    Context.prototype.getKey = function () {
        return this.key;
    };
    return Context;
})();
exports.Context = Context;
//# sourceMappingURL=chat-persistence-service.js.map