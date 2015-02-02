/// <reference path="typings/tsd.d.ts" />
var express = require('express');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var chat = require('./front/chat/index');
var factory = require('./factory');
var domainFactory = require('./domain/factory');
var env = require('./env');
var cors = require('cors');
global.settings = env.getEnv(process.env.NODE_ENV);
var rootApp = express();
rootApp.use(cors());
rootApp.use(bodyParser.json());
rootApp.use(cookieParser());
var httpServer = http.createServer(rootApp);
rootApp.use('/chat', createChatController());
httpServer.listen(8085);
function createChatController() {
    var store = factory.createRedisClient();
    return chat.init(factory.createSocketServer(httpServer), function (c) { return domainFactory.createChatService(store, factory.createSubscriber, c); });
}
//# sourceMappingURL=dev.js.map