/// <reference path="../typings/tsd.d.ts" />
define(["require", "exports", '../config'], function (require, exports, app) {
    angular.module(app.name).controller(app.contrl.chat, ChatController);
    ChatController.$inject = [app.srv.chat, '$timeout'];
    function ChatController(chatService, $timeout) {
        var vm = this;
        vm.messages = [];
        chatService.listen(function (message) {
            $timeout(addMessage.bind(null, message));
        });
        function addMessage(message) {
            vm.messages.unshift({ text: message.text, time: new Date(message.time) });
        }
    }
});
//# sourceMappingURL=chat-controller.js.map