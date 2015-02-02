var persistence = require('./chat-persistence-service');
var Service = (function () {
    function Service(serviceFactory, socket) {
        this.serviceFactory = serviceFactory;
        this.socket = socket;
        this.reading = false;
        this.newsAvailable = true;
        this.connected = false;
        this.listenOnSocket();
    }
    Service.prototype.listenOnSocket = function () {
        var _this = this;
        this.socket.on('disconnect', function () { return _this.connected = false; });
        this.socket.on('choose-chat', this.onChooseChat.bind(this));
        this.socket.on('add-message', this.onAddMessage.bind(this));
    };
    Service.prototype.onChooseChat = function (data) {
        this.connected = true;
        var users = [data.otherUserId, this.socket.client.request.decoded_token.id];
        this.persistContext = new persistence.Context(users);
        this.latestRead = data.lastReadCounter || 0;
        this.persistService = this.serviceFactory(this.persistContext);
        this.persistService.listenForNews(this.onNews.bind(this));
    };
    Service.prototype.onNews = function () {
        this.newsAvailable = true;
        !this.reading && this.connected && this.readNext();
    };
    Service.prototype.onAddMessage = function (data) {
        data.author = this.socket.client.request.decoded_token.id;
        this.persistService.addMessage(data).error(function (e) {
            // TODO: notify message could not be persisted
        });
    };
    Service.prototype.readNext = function () {
        var _this = this;
        this.newsAvailable = false;
        this.reading = true;
        this.persistService.readMessagesAfter(this.latestRead).then(function (messages) {
            if (_this.connected) {
                _this.socket.emit('news', messages);
                messages && messages.length && (_this.latestRead = messages[0].counter);
                _this.newsAvailable && _this.readNext();
            }
        }).error(function (e) {
            // TODO: notify
        }).finally(function () {
            _this.reading = false;
        });
    };
    return Service;
})();
exports.Service = Service;
function onNewSocket(serviceFactory, socket) {
    new Service(serviceFactory, socket);
}
exports.onNewSocket = onNewSocket;
//# sourceMappingURL=chat-socket-service.js.map