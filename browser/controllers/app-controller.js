(function () {
    'use strict';

    angular.module(app.name).controller(app.contrl.app, AppController);

    AppController.$inject = [];

    function AppController() {
        var vm = this;
        vm.ready = true;
    }
})();
