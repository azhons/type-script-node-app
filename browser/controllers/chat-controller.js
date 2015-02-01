/// <reference path="../typings/tsd.d.ts" />
define(["require", "exports", '../config'], function (require, exports, app) {
    angular.module(app.name).controller(app.contrl.chat, ChatController);
    ChatController.$inject = [app.srv.chat, '$timeout'];
    function ChatController(chatService, $timeout) {
        var vm = this;
        vm.messages = [];
        vm.login = login;
        vm.user = "";
        vm.token = "";
        function addMessage(message) {
            vm.messages.unshift({ text: message.text, time: new Date(message.time) });
        }
        function onMessage(message) {
            $timeout(addMessage.bind(null, message));
        }
        function login() {
            chatService.login(vm.user).then(function (t) {
                vm.token = t.data.token;
            }).then(function () {
                chatService.listen(vm.token, onMessage);
            });
        }
    }
});
//# sourceMappingURL=chat-controller.js.map