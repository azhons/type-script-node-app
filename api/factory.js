/// <reference path="typings/all.ts" />
var Promise = require('bluebird');
var redis = require('redis');
var sockets = require('socket.io');
var socketioJwt = require('socketio-jwt');
var factory = {
    createRedisClient: function () {
        var settings = global.settings;
        var client;
        if (settings.redisHost && settings.redisPort) {
            client = redis.createClient(settings.redisPort, settings.redisHost);
        }
        else {
            client = redis.createClient();
        }
        Promise.promisifyAll(client);
        return client;
    },
    createSubscriber: function () {
        return redis.createClient();
    },
    createSocketServer: function (httpServer) {
        var io = sockets.listen(httpServer);
        io.set('authorization', socketioJwt.authorize({
            secret: "my secret",
            handshake: true
        }));
        return io;
    }
};
module.exports = factory;
//# sourceMappingURL=factory.js.map