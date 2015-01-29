(function () {
    'use strict';

    angular.module(app.name).factory(app.srv.chat, getChatService);

    getChatService.$inject = [];

    function getChatService() {

        var socket = io('http://localhost:8085');

        var service = {
            listen: function (handler)
            {
                socket.on('news', function (data) {
                    handler(data);
                });

                socket.on('reconnect', function () { console.log('reconnected'); })
            }
        };

        return service;
    }

})();