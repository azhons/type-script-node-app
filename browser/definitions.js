define([
    "require",
    "main"
], function (require, main) {
    
    require([
        "services/chat-service",
        "controllers/app-controller",
        "controllers/chat-controller",
        "directives/formatTimeDirective"
    ], function () {
        main.init();
    });
});