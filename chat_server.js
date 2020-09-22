// 노드로 실행할 것.

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({port:8081});