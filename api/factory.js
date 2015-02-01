/// <reference path="typings/all.ts" />
var Promise = require('bluebird');
var redis = require('redis');
var sockets = require('socket.io');
var socketioJwt = require('socketio-jwt');
var factory = {
    createRedisClient: function (host, port) {
        var client;
        if (host && port) {
            client = redis.createClient(port, host);
        }
        else {
            client = redis.createClient();
        }
        Promise.promisifyAll(client);
        return client;
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