/// <reference path="typings/tsd.d.ts" />
import express = require('express');
import http = require('http');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import chat = require('./front/chat/index');
import factory = require('./factory');
import domainFactory = require('./domain/factory');
import env = require('./env');
var cors = require('cors');
var path = require('path');

global.settings = env.getEnv(process.env.NODE_ENV);

var rootApp = express();

rootApp.use(cors());
rootApp.use(bodyParser.json());
rootApp.use(cookieParser());

var httpServer = http.createServer(rootApp);
rootApp.use('/chat', createChatController());

//rootApp.use('/', express.static(path.join(__dirname, '/../browser')));

httpServer.listen(8085);

function createChatController()
{
    var store = factory.createRedisClient();

    return chat.init(
        factory.createSocketServer(httpServer),
        c => domainFactory.createChatService(store, factory.createSubscriber, c));
}