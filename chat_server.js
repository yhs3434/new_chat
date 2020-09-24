// 노드로 실행할 것.

const wsLib = require('./lib/websocket');
const decodeFromJs = wsLib.decodeFromJs;

const WebSocket = require('ws');
const wss = new WebSocket.Server({port:8081});

let users = new Map();

wss.on('connection', (ws) => {
    //console.log(ws);
    ws.on('message', (req) => {
        const message = decodeFromJs(req);
        // console.log(`received : ${message}`);
        const {type, payload} = message;
        if (type === 'init') {
            const {clientId} = payload;
            console.log(`${clientId} is connected`);

            const payload = {
                clientId : clientId,
                groupId : users[clientId]
            };
            const res = {
                type : 'init',
                payload : payload
            };
            ws.send(res);
        } else if (type === 'join') {
            const {clientId, groupId} = payload;

            if (typeof(users[clientId]) === 'undefined') {
                users[clientId] = new Array();
            }
            users[clientId].push(groupId);
            
        } else if (type === 'withdraw') {
            const {clientId, groupId} = payload;

            const idx = users[clientId].indexOf(groupId);
            if (idx > -1) {
                users[clientId].splice(idx, 1);
            }
        } else if (type === 'message') {
            const {msg} = payload;
            console.log(`message : ${msg}`);
        }
    });

    ws.send('something');
})