// 노드로 실행할 것.

const wsLib = require('./lib/websocket');
const decodeFromJs = wsLib.decodeFromJs;

const WebSocket = require('ws');
const wss = new WebSocket.Server({port:8081});

const user_ws = new Map();
// user_ws 는 유저의 클라이언트 아이디와 ws 객체를 연결
const group_user = new Map();
// group_user 는 그룹에 어떤 유저들이 속해있는지 연결

wss.on('connection', (ws) => {
    //console.log(ws);
    ws.on('message', (req) => {
        const {type, payload} = decodeFromJs(req);
        if (type === 'open') {
            const {clientId} = payload;
            console.log(`${clientId} is connected`);
            user_ws.set(clientId, ws);
            ws.clientId = clientId;

            user_ws.forEach(logMapElements);

        } else if (type === 'join') {
            const {clientId, groupId} = payload;

            if (!group_user.has(groupId)) {
                group_user.set(groupId, new Array());
            }
            group_user.get(groupId).push(clientId);

        } else if (type === 'withdraw') {
            const {clientId, groupId} = payload;

            const idx = group_user.get(groupId).indexOf(clientId);
            if (idx > -1) {
                group_user.get(groupId).splice(idx, 1);
            }
            if (group_user.get(groupId).length === 0) {
                group_user.delete(groupId);
            }
        } else if (type === 'message') {
            const {msg} = payload;
            console.log(`message : ${msg}`);
        }
    });

    ws.on('close', (event) => {
        user_ws.delete(ws.clientId);
    })
})

function logMapElements(value, key, map) {
    console.log(`${key} : ${value.clientId}`);
}
