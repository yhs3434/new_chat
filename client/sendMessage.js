// 메세지 전송 js

const host = "localhost";
const port = 8081;
const hostPort = `ws://${host}:${port}`;

console.log(hostPort);

const ws = new WebSocket(hostPort);
ws.onopen = (evt) => {
    ws.send('test');
}