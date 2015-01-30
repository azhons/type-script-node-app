/// <reference path="../typings/tsd.d.ts" />
define(["require", "exports", '../config', 'socket.io-client'], function (require, exports, app, io) {
    angular.module(app.name).factory(app.srv.chat, getChatService);
    getChatService.$inject = [];
    var socket = io('http://localhost:8085');
    function getChatService() {
        return new ChatService();
    }
    var ChatService = (function () {
        function ChatService() {
        }
        ChatService.prototype.listen = function (handler) {
            socket.on('news', function (data) {
                handler(data);
            });
            socket.on('reconnect', function () {
                console.log('reconnected');
            });
        };
        return ChatService;
    })();
});
//# sourceMappingURL=chat-service.js.map