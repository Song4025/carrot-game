// [기능구현]
// 1. 플레이버튼을 눌렀을때 벌레와 당근이 랜덤한 위치에 놓여져야함.
// 2. 플레이시간이 초마다 변경되어야함.
// 3. 플레이시간이 0이되면 더이상 당근을 클릭할 수 없음.(게임종료)
// 4. 실수로 벌레를 클릭하게되면 게임종료
// 5. 최초 당근개수: 10개, 당근을 클릭할 때마다 count가 내려가야함.
// 6. 게임이 종료되면 팝업창이 나타나며 'you win' or 'you lost'가 떠야함
// 7. 팝업안에 refresh버튼을 누르면 게임을 재시작할수있음.

'use strict';

// [벌레와 당근 랜덤위치에 놓기]

// 게임필드 가지고오기
const CARROT_SIZE = 80;
const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 7;

const field = document.querySelector('.game_field');
const fieldRect = field.getBoundingClientRect();
// 시작버튼, 타이머, 카운트
const btnGame = document.querySelector('.game_button');
const gameTimer = document.querySelector('.game_timer');
const gameScore = document.querySelector('.game_score');

// 팝업창 관련
const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up_message');
const popUpRefresh = document.querySelector('.pop-up_refresh');

// 게임이 시작되었는지 안되었는지?
let started = false;
// 최종적인 스코어
let score = 0;
// 총 시간기억함
let timer = undefined;

field.addEventListener('click', (e) => onFieldClick(e))

btnGame.addEventListener('click', () => {
    if(started){
        stopGame();
    } else {
        startGame();
    }
});

popUpRefresh.addEventListener('click', () => {
    // startGame();
    // hidePopup();
    history.go(0);
});

function startGame() {
    started = true;
    initGame();
    btnShowStop();
    showTimerAndScore();
    startGameTimer();
}

function stopGame() {
    started = false;
    stopGameTimer();
    hideGameButton();
    showPopupWithText('REPLAY❓');
}

function finishGame(win) {
    started = false;
    hideGameButton();
    showPopupWithText(win ? 'YOU WIN 👍' : 'YOU LOST 😜')
}

function btnShowStop() {
    const icon = btnGame.querySelector('.fa-solid');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    btnGame.style.visibility = 'visible';
}

function hideGameButton() {
    btnGame.style.visibility = 'hidden';
}

function showTimerAndScore() {
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';
}

function startGameTimer() {
    let remainingTimeSec = GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer = setInterval(() => {
        if(remainingTimeSec <= 0){
            clearInterval(timer);
            finishGame(CARROT_COUNT === score)
            return;
        }
        updateTimerText(--remainingTimeSec);
    }, 1000)
}

function stopGameTimer() {
    clearInterval(timer);
}

function updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerHTML =  `${minutes}:${seconds}`
}

// play중 stop버튼 누르면 보여주는 팝업
function showPopupWithText(text) {
    popUpText.innerText = text;
    popUp.classList.remove('pop-up-hide');
}

// refresh 후 팝업다시 없애는 함수
function hidePopup() {
    popUp.classList.add('pop-up-hide');
}

// 벌래와 당근 생성 후 field안에 추가
function initGame() {
    field.innerHTML = '';
    gameScore.innerHTML = CARROT_COUNT;
    console.log("fieldRect", fieldRect);
    itemCreate('carrot', CARROT_COUNT, 'asset/img/carrot.png');
    itemCreate('bug', BUG_COUNT, 'asset/img/bug.png');
}

function onFieldClick(e) {
    if (!started) {
        return; 
    }
    const target = e.target;
    if(target.matches('.carrot')) {
        console.log("당근찾음")
        target.remove();
        score++;
        updateScoreBoard();
        if(score === CARROT_COUNT){
            finishGame(true);
        }
    } else if(target.matches('.bug')) {
        console.log("벌레우웩");
        stopGameTimer();
        finishGame(false);
    }
}

function updateScoreBoard() {
    gameScore.innerText = CARROT_COUNT - score;
}

function itemCreate(className, count, imgPath){
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - CARROT_SIZE;
    const y2 = fieldRect.height - CARROT_SIZE;

    for (let i = 0; i < count; i++){
        const item = document.createElement('img');
        item.setAttribute('class', className);
        item.setAttribute('src', imgPath);
        item.style.position = 'absolute';
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min, max){
    return Math.random() * (max - min) + min;
}

