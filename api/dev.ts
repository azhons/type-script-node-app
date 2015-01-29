/// <reference path="typings/tsd.d.ts" />
import express = require('express');
import http = require('http');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import chat = require('./front/chat/index');
var cors = require('cors');

var rootApp = express();

//rootApp.use(cors());
rootApp.use(bodyParser.json());
rootApp.use(cookieParser());

var server = http.createServer(rootApp);

rootApp.use('/chat', chat(server));

server.listen(8085);