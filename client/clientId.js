// 클라이언트 아이디 생성

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

const clientId = getRandomInt(10000, 100000);
let elem = document.getElementById('inputClientId');
elem.value = clientId;