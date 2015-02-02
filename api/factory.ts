/// <reference path="typings/all.ts" />
import Promise = require('bluebird');
import redis = require('redis');
import sockets = require('socket.io');
import http = require('http');
var socketioJwt = require('socketio-jwt');

var factory =
{
    createRedisClient: (): redis.RedisClient => {
        var client = redis.createClient();
        Promise.promisifyAll(client);
        return client;
    },
    createSubscriber: (): redis.RedisClient => {
        return redis.createClient();
    },
    createSocketServer: (httpServer: http.Server): SocketIO.Server => {
        var io = sockets.listen(httpServer);
        io.set('authorization', socketioJwt.authorize({
            secret: "my secret",
            handshake: true
        }));
        return io;
    }
};

export = factory;