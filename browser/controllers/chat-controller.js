(function () {
    'use strict';

    angular.module(app.name).controller(app.contrl.chat, ChatController);

    ChatController.$inject = [app.srv.chat, '$timeout'];

    function ChatController(chatService, $timeout) {
        var vm = this;
        vm.messages = [];
        
        chatService.listen(function (message) {
            $timeout(addMessage.bind(null, message));
        });

        function addMessage(message) {
            vm.messages.push(message);
        }
    }
})();
