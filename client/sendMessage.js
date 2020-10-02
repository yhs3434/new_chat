

function encodeToJs(message) {
    return escape(JSON.stringify(message));
}
function decodeFromJs(message) {
    return JSON.parse(unescape(message));
}

window.onload = () => {
    const host = "localhost";
    const port = 8081;
    const hostPort = `ws://${host}:${port}`;
    
    const clientId = document.getElementById('inputClientId').value;
    
    const ws = new WebSocket(hostPort, clientId);
    
    //
    // open
    //
    ws.onopen = (event) => {
        
        /*
        ws.send(encodeToJs(
            {
                type: 'open',
                payload: {
                    clientId
                }
            }
        ));
        */
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
            const ulClient = document.getElementById('ulClient');
            ulClient.innerHTML = '';
            for (const user of users) {
                const elem = document.createElement('li');
                elem.innerText = user;
                const chatBtn = document.createElement('button');
                chatBtn.innerText = "1:1 채팅";
                chatBtn.onclick = (event) => {
                    const data = {
                        type : "ws",
                        payload : {
                            clientId : user
                        }
                    };
                    ws.send(encodeToJs(data));
                }
                elem.appendChild(chatBtn);
                ulClient.appendChild(elem);
            }
        } else if (type === "ws") {
            const obj = payload.ws;
            if (obj === null) {
                console.log("There is not a user");
            } else {
                console.log(obj);
                Object.setPrototypeOf(obj, Object.getPrototypeOf(ws));
                obj.send('test');
            }
        } else if (type === "chat") {
            const {clientId, groupId, content} = payload;
            const parent = document.getElementById("ulChat");
            const child = document.createElement("li");
            child.innerText = `${clientId} : ${content}`;
            parent.appendChild(child);
        }
        
    }
    //
    // error
    //
    ws.onerror = (error) => {
        alert('WebSocket Error ' + error);
    };
    
    function buttonClick() {
        const elem = document.getElementById('inputMessage');
        const value = elem.value;
        elem.value = '';
        const data = {
            type: 'chat',
            payload: {
                clientId,
                groupId : 0,
                content : value
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
}

