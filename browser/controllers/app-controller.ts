/// <reference path="../typings/tsd.d.ts" />

import app = require('../config');

angular.module(app.name).controller(app.contrl.app, AppController);

AppController.$inject = [];

function AppController() {
    var vm = this;
    vm.ready = true;
}