/// <reference path="typings/all.ts" />
import Promise = require('bluebird');
import redis = require('redis');
import sockets = require('socket.io');
import http = require('http');
import settings = require('./env');
var socketioJwt = require('socketio-jwt');

var factory =
{
    createRedisClient: (): redis.RedisClient => {

        var settings: settings.Settings = global.settings;
        var client;

        if (settings.redisHost && settings.redisPort) {
            client = redis.createClient(settings.redisPort, settings.redisHost);
        } else
        {
            client = redis.createClient();
        }

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