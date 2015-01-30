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
        
    chatService.listen(message => {
        $timeout(addMessage.bind(null, message));
    });

    function addMessage(message: schemas.ChatMessage) {
        vm.messages.unshift({ text: message.text, time: new Date(message.time)});
    }
}