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
        }
        ChatService.prototype.listen = function (token, handler) {
            var socket = io.connect('http://localhost:8085', {
                query: 'token=' + token
            });
            socket.on('error', function (e) {
                console.log("error");
                console.log(arguments);
            });
            socket.on('news', function (data) {
                handler(data);
            });
            socket.on('connect', function () {
                console.log('connect');
                console.log(arguments);
            });
            socket.on('disconnect', function () {
                console.log('disconnect');
                console.log(arguments);
            });
            socket.on('reconnect', function () {
                console.log('reconnected');
            });
        };
        ChatService.prototype.login = function (user) {
            return this.$http.post("http://localhost:8085/chat/auth", { id: user });
        };
        return ChatService;
    })();
});
//# sourceMappingURL=chat-service.js.map