require.config({
    paths: {
        'angular': 'lib/angular',
        'ngRoute': 'lib/angular-route',
        'bootstrap': 'lib/bootstrap.min',
        'socket.io-client': 'https://cdn.socket.io/socket.io-1.3.2'
    },
    shim: {
        ngRoute: {
            deps: ['angular'],
            exports: 'angular'
        },
        angular: {
            deps: ['lib/jquery'],
            exports: 'angular'
        },
        bootstrap: {
            deps: ['lib/jquery']
        }
    }
});

define([
    "./config",
    "angular",
    "ngRoute",
    "bootstrap",
    "socket.io-client",
    "lib/jquery.js",
    "./extensions",
],function (config) {
    'use strict';

    return angular.module(config.name, ['ngRoute']);
});