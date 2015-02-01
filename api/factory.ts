/// <reference path="typings/all.ts" />
import Promise = require('bluebird');
import redis = require('redis');
import sockets = require('socket.io');
import http = require('http');
var socketioJwt = require('socketio-jwt');

var factory =
{
    createRedisClient: (host?: string, port?: number): redis.RedisClient => {
        var client;
        if (host && port) {
            client = redis.createClient(port, host);
        }
        else
        {
            client = redis.createClient();
        }

        Promise.promisifyAll(client);
        return client;
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