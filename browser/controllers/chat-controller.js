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
        vm.chatMessage = "";
        vm.sendMessage = sendMessage;
        function addMessages(messages) {
            messages && messages.length && vm.messages.unshift.apply(vm.messages, messages);
        }
        function onMessages(messages) {
            $timeout(addMessages.bind(null, messages));
        }
        function login() {
            chatService.login(vm.user).then(function (t) {
                vm.token = t.data.token;
            }).then(function () {
                chatService.listen(vm.token, onMessages);
                chatService.chooseChat({ lastReadCounter: 0, otherUserId: (vm.user === "1" ? 2 : 1) });
            });
        }
        function sendMessage() {
            chatService.sendMessage(vm.chatMessage);
            // TODO: persist until delivered:
            vm.chatMessage = "";
        }
    }
});
//# sourceMappingURL=chat-controller.js.map