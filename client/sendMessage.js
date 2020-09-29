// 메세지 전송 js

function encodeToJs(message) {
    return escape(JSON.stringify(message));
}
function decodeFromJs(message) {
    return JSON.parse(unescape(message));
}

const host = "localhost";
const port = 8081;
const hostPort = `ws://${host}:${port}`;

const ws = new WebSocket(hostPort);

//
// open
//
ws.onopen = (event) => {
    const clientId = document.getElementById('inputClientId').value;
    ws.send(encodeToJs(
        {
            type: 'open',
            payload: {
                clientId
            }
        }
    ));
    ws.send(encodeToJs(
        {
            type: 'connecting',
            payload: {

            }
        }
    ));
}

//
// close
//
ws.onclose = (event) => {
    const clientId = document.getElementById('inputClientId').value;
    console.log(`${clientId} is closed`);
}

//
// message
//
ws.onmessage = (event) => {
    const data = decodeFromJs(event.data);
    console.log("WebSocket message received : ", data);
    const {type, payload} = data;

    if (type === "connecting") {
        const users = JSON.parse(payload.users);
        console.log('users', users);
        const ulClient = document.getElementById('ulClient');
        for (const user of users) {
            const elem = document.createElement('li');
            elem.innerText = user;
            ulClient.appendChild(elem);
        }
    }
    
}

function buttonClick() {
    const elem = document.getElementById('inputMessage');
    const value = elem.value;
    elem.value = '';
    const data = {
        type: 'message',
        payload: {
            msg: value
        }
    };
    ws.send(encodeToJs(data));
};

document.getElementById('btnSend').addEventListener("click", buttonClick);
document.getElementById('inputMessage').addEventListener("keyup", (evt) => {
    if (window.event.keyCode === 13) {
        buttonClick();
    }
});

const connecting = new Array();
