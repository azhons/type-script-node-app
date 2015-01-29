/// <reference path="typings/tsd.d.ts" />
var express = require('express');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var chat = require('./front/chat/index');
var cors = require('cors');
var rootApp = express();
//rootApp.use(cors());
rootApp.use(bodyParser.json());
rootApp.use(cookieParser());
var server = http.createServer(rootApp);
rootApp.use('/chat', chat(server));
server.listen(8085);
//# sourceMappingURL=dev.js.map