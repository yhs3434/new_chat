// 노드로 실행할 것.

const wsLib = require('./lib/websocket');
const decodeFromJs = wsLib.decodeFromJs;
const encodeToJs = wsLib.encodeToJs;

const WebSocket = require('ws');
const wss = new WebSocket.Server({port:8081});

const user_ws = new Map();
// user_ws 는 유저의 클라이언트 아이디와 ws 객체를 연결
const group_user = new Map();
// group_user 는 그룹에 어떤 유저들이 속해있는지 연결

wss.on('connection', (ws) => {
    //console.log(ws);
    
    const clientId = ws.protocol;
    console.log(`${clientId} is connected`);
    user_ws.set(clientId, ws);
    user_ws.forEach(logMapElements);

    const users = new Array();
    for (const entry of user_ws.entries()) {
        users.push(entry[0]);
    }
    const connectingUsers = {
        type: 'connecting',
        payload: {
            users: JSON.stringify(users)
        }
    };
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(encodeToJs(connectingUsers));
        }
    })

    ws.on('message', (frame) => {
        const {type, payload} = decodeFromJs(frame);

        if (type === 'join') {
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
        } else if (type === 'connecting') {
            const users = new Array();

            for (const entry of user_ws.entries()) {
                users.push(entry[0]);
            }
            const data = {
                type: 'connecting',
                payload: {
                    users: JSON.stringify(users)
                }
            };
        } else if (type === 'ws') {
            const {clientId} = payload;
            if (user_ws.has(clientId.toString())) {
                const obj = user_ws.get(clientId.toString());
                const data = {
                    type : "ws",
                    payload : {
                        ws : obj
                    }
                };
                ws.send(encodeToJs(data));
            } else {
                const data = {
                    type : "ws",
                    payload : {
                        ws : null
                    }
                };
                ws.send(encodeToJs(data));
            }
            
        } else if (type === "chat") {
            const {clientId, groupId, content} = payload;
            console.log(clientId, groupId, content);
            // 이 부분 이어서 할 것
        }
    });

    ws.on('close', (event) => {
        user_ws.delete(ws.protocol);

        const users = new Array();
        for (const entry of user_ws.entries()) {
            users.push(entry[0]);
        }
        const connectingUsers = {
            type: 'connecting',
            payload: {
                users: JSON.stringify(users)
            }
        };
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                
                client.send(encodeToJs(connectingUsers));
            }
        })
    })
})

function logMapElements(value, key, map) {
    console.log(`${key} : ${value.protocol}`);
}
