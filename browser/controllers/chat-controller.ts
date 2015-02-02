/// <reference path="../typings/tsd.d.ts" />

import app = require('../config');
import IChatService = require('../services/chat-service');
import schemas = require('../global-schemas');
import ChatMessage = schemas.ChatMessage;

angular.module(app.name).controller(app.contrl.chat, ChatController);

ChatController.$inject = [app.srv.chat, '$timeout'];

function ChatController(chatService: IChatService, $timeout) {
    var vm = this;

    vm.messages = [];
    vm.login = login;
    vm.user = "";
    vm.token = "";
    vm.chatMessage = "";
    vm.sendMessage = sendMessage;
      
    function addMessages(messages: schemas.ChatMessage[]) {
        messages && messages.length && vm.messages.unshift.apply(vm.messages, messages);
    }

    function onMessages(messages: schemas.ChatMessage[])
    {
        $timeout(addMessages.bind(null, messages));
    }

    function login()
    {
        chatService.login(vm.user)
            .then(t=> { vm.token = t.data.token; })
            .then(() => {
                chatService.listen(vm.token, onMessages);
                chatService.chooseChat({ lastReadCounter: 0, otherUserId: (vm.user === "1" ? 2 : 1) });
            });
    }

    function sendMessage()
    {
        chatService.sendMessage(vm.chatMessage);
        // TODO: persist until delivered:
        vm.chatMessage = "";
    }
}