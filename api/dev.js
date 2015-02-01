/// <reference path="typings/tsd.d.ts" />
var express = require('express');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var chat = require('./front/chat/index');
var factory = require('./factory');
var domainFactory = require('./domain/factory');
var cors = require('cors');
var rootApp = express();
rootApp.use(cors());
rootApp.use(bodyParser.json());
rootApp.use(cookieParser());
var httpServer = http.createServer(rootApp);
rootApp.use('/chat', createChatController());
httpServer.listen(8085);
function createChatController() {
    var redisClient = factory.createRedisClient();
    return chat.init(factory.createSocketServer(httpServer), function (c) { return domainFactory.createChatService(redisClient, c); });
}
//# sourceMappingURL=dev.js.map