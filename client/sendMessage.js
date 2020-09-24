// 메세지 전송 js

function encodeToJs(message) {
    return escape(JSON.stringify(message));
}

const host = "localhost";
const port = 8081;
const hostPort = `ws://${host}:${port}`;

console.log(hostPort);

const ws = new WebSocket(hostPort);
ws.onopen = (evt) => {
    ws.send(encodeToJs(
        {
            type: 'start',
            payload: {
                message: 'test'
            }
        }
    ));
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