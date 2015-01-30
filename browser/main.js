define([
    "app",
    "config"
], function (app, config) {
    
    function configApp($routeProvider, $httpProvider) {
        configRoutes($routeProvider);
    }

    configApp.$inject = ['$routeProvider', '$httpProvider'];

    function configRoutes($routeProvider)
    {
        $routeProvider
            .when('/chat', { templateUrl: 'views/chat.html', controller: config.contrl.chat, controllerAs: 'vm' })
            .otherwise({ redirectTo: '/chat' });
    }

    app.config(configApp);
    app.init = function () {
        angular.bootstrap(document, [config.name]);
    };

    return app;
});