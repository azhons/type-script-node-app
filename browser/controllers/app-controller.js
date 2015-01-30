/// <reference path="../typings/tsd.d.ts" />
define(["require", "exports", '../config'], function (require, exports, app) {
    angular.module(app.name).controller(app.contrl.app, AppController);
    AppController.$inject = [];
    function AppController() {
        var vm = this;
        vm.ready = true;
    }
});
//# sourceMappingURL=app-controller.js.map