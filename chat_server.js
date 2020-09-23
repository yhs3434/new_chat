// 노드로 실행할 것.

const WebSocket = require('ws');
const wss = new WebSocket.Server({port:8081});

wss.on('connection', (ws) => {
    //console.log(ws);
    ws.on('message', (message) => {
        console.log(`received : ${message}`);
    });

    ws.send('something');
})