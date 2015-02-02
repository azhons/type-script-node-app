/// <reference path="../typings/tsd.d.ts" />
define(["require", "exports", '../config', 'socket.io-client'], function (require, exports, app, io) {
    angular.module(app.name).factory(app.srv.chat, getChatService);
    getChatService.$inject = ['$http'];
    function getChatService($http) {
        return new ChatService($http);
    }
    var ChatService = (function () {
        function ChatService($http) {
            this.$http = $http;
            this.connected = false;
        }
        ChatService.prototype.listen = function (token, handler) {
            var _this = this;
            if (this.socket) {
                return;
            }
            this.socket = io.connect('http://localhost:8085', {
                query: 'token=' + token
            });
            this.socket.on('error', function () {
                _this.connected = false;
            });
            this.socket.on('news', function (data) {
                handler(data);
                data && data.length && (_this.chatContext.lastReadCounter = data[0].counter);
            });
            this.socket.on('connect', function () {
                _this.connected = true;
                _this.connectToChat();
            });
            this.socket.on('disconnect', function () {
                _this.connected = false;
            });
        };
        ChatService.prototype.chooseChat = function (context) {
            this.chatContext = context;
            this.connectToChat();
        };
        ChatService.prototype.login = function (user) {
            this.user = user;
            return this.$http.post("http://localhost:8085/chat/auth", { id: user });
        };
        ChatService.prototype.sendMessage = function (messageText) {
            var m = { text: messageText };
            this.socket.emit('add-message', m);
        };
        ChatService.prototype.connectToChat = function () {
            this.chatContext && this.connected && this.socket.emit('choose-chat', this.chatContext);
        };
        return ChatService;
    })();
});
//# sourceMappingURL=chat-service.js.map