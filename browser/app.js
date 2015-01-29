(function () {
    'use strict';

    angular.module(app.name, ['ngRoute', 'ui.bootstrap']).config(configApp).run(runApp);

    configApp.$inject = ['$routeProvider', '$httpProvider'];

    function configRoutes($routeProvider)
    {
        $routeProvider
            .when('/chat', { templateUrl: 'views/chat.html', controller: app.contrl.chat, controllerAs: 'vm' })
            .otherwise({ redirectTo: '/chat' });
    }

    function configInterceptors($httpProvider)
    {
        var pendingRequests = 0;

        $httpProvider.interceptors.push(['$q', '$rootScope', '$injector', '$timeout', function ($q, $rootScope, $injector, $timeout) {

            var longRequestTimeout = null;

            function finisRequest()
            {
                pendingRequests--;
                if (pendingRequests === 0) {
                    
                    if (longRequestTimeout !== null)
                    {
                        $timeout.cancel(longRequestTimeout);
                        longRequestTimeout = null;
                    }

                    $rootScope.appBusy = false;
                    $rootScope.longRequest = false;
                }
            }

            function queueLongRequestTimeout()
            {
                if (longRequestTimeout === null)
                {
                    longRequestTimeout = $timeout(function () { $rootScope.longRequest = true; }, 400);
                }
            }

            return {
                'request': function (config) {
                    $rootScope.appBusy = true;
                    pendingRequests++;
                    queueLongRequestTimeout();

                    return config;
                },

                'response': function (response) {
                    finisRequest();
                    return response;
                },
                'responseError': function (rejection) {
                    return $q.reject(rejection);
                }
            };
        }]);
    }

    function configApp($routeProvider, $httpProvider)
    {
        configRoutes($routeProvider);
        configInterceptors($httpProvider);
    }

    function runApp()
    {
    }

})();