const gameBoard = document.querySelector('#gameBoard') as HTMLCanvasElement;
const ctx = gameBoard.getContext("2d")!;
const leftScoreElement = document.querySelector('#leftScore')!;
const rightScoreElement = document.querySelector('#rightScore')!;
const resetButton = document.querySelector('#resetButton')!;
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "#0f172a"
const paddle1Color = "#a78bfa"
const paddle2Color = "#22d3ee"
const paddleBorder = "transparent"
const ballColor = "#f8fafc"
const ballBorderColor = "rgba(248, 250, 252, 0.25)"
const ballRadius = 12.5
const maxBallSpeed = 3
const paddleSpeed = 3.5
let intervalID: number;
let ballSpeed = 1
let ballX = gameWidth / 2
let ballY = gameHeight / 2
let ballXDirection = 0
let ballYDirection = 0
let player1Score = 0
let player2Score = 0

let keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

let paddle1 = {
    width:  10,
    height: 95,
    x: 25,
    y: 0
}

let paddle2 = {
    width: 10,
    height: 95,
    x: gameWidth - 39,
    y: 0
}

paddle1.y = (gameHeight / 2) - (paddle1.height / 2)
paddle2.y = (gameHeight / 2) - (paddle1.height / 2)

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);
resetButton.addEventListener("click", resetGame);


gameStart();

function gameStart(){
    createBall()
    nextTick()
}

function nextTick(){
    intervalID = setTimeout(() => {
        clearBoard()
        drawCenterLine()
        drawPaddles()
        moveBall()
        movePaddles()
        checkCollision()
        drawBall(ballX, ballY)
        nextTick()
    }, 0.06)
}

function clearBoard(){
    ctx.fillStyle = boardBackground
    ctx.fillRect(0, 0, gameWidth, gameHeight)
}

function drawCenterLine(){
    ctx.strokeStyle = "rgba(100, 116, 139, 0.25)";
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 12]);
    ctx.moveTo(gameWidth / 2, 0);
    ctx.lineTo(gameWidth / 2, gameHeight);
    ctx.stroke();

    ctx.strokeStyle = "rgba(100, 116, 139, 0.25)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(gameWidth / 2, gameHeight / 2, 150, 0 ,10 * Math.PI)
    ctx.stroke()
}

function drawPaddles(){
    ctx.shadowBlur = 18;
    ctx.shadowColor = paddle1Color;
    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    
    ctx.shadowColor = paddle2Color;
    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    
    ctx.shadowBlur = 0;
}
function createBall(){
    ballSpeed = 1;
    if (Math.round(Math.random()) == 1){
        ballXDirection = 1;
    }
    else{
        ballXDirection = -1;
    }
    if (Math.round(Math.random()) == 1){
        ballYDirection = 1;
    }
    else{
        ballYDirection = -1;
    }
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    drawBall(ballX, ballY);
}

function drawBall(ballX: number, ballY: number){
    ctx.shadowBlur = 16;
    ctx.shadowColor = ballColor;
    
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorderColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    ctx.shadowBlur = 0;
}

function moveBall(){
    if (ballSpeed > maxBallSpeed)
        ballSpeed = maxBallSpeed
    console.log(ballSpeed)
    ballX += (ballSpeed * ballXDirection)
    ballY += (ballSpeed * ballYDirection)
}


function checkCollision(){
    if (ballY <= 0 + ballRadius)
            ballYDirection *= -1
    if (ballY >= (gameHeight - ballRadius))
            ballYDirection *=  -1
    if (ballX <= 0){
            player2Score += 1
            updateScore()
            if (player2Score === 5 ){
                clearInterval(intervalID);
                window.location.href = `./Winner.html?winner=2&score1=${player1Score}&score2=${player2Score}`;
                return;
            }
            createBall()
            return;
    }
    if (ballX >= gameWidth){
        player1Score += 1
        updateScore()
        if (player1Score === 5){
            clearInterval(intervalID)
            window.location.href = `./Winner.html?winner=1&score1=${player1Score}&score2=${player2Score}`
            return ;
        }
        createBall()
        return;
    }
    if (ballX <= (paddle1.x + paddle1.width + ballRadius)){
        if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height){
                ballX = (paddle1.x + paddle1.width) + ballRadius
                ballXDirection *= -1
                ballSpeed += 0.35
            let collidePoint = ballY - (paddle1.y + paddle1.height / 2)
            collidePoint = collidePoint / (paddle1.height / 2)
            let angleRad = (Math.PI / 3) * collidePoint
            ballYDirection = Math.sin(angleRad) * 1.5
        }
    }
    if (ballX >= (paddle2.x - ballRadius)){
        if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height){
                ballX = paddle2.x - ballRadius
                ballXDirection *= -1
                ballSpeed += 0.35
            let collidePoint = ballY - (paddle2.y + paddle2.height / 2)
            collidePoint = collidePoint / (paddle2.height / 2)
            let angleRad = (Math.PI / 3) * collidePoint
            ballYDirection = Math.sin(angleRad) * 1.5
        }
    }
}

function keyDown(event: KeyboardEvent){
    switch(event.key){
        case 'w':
        case 'W':
            keys.w = true;
            break;
        case 's':
        case 'S':
            keys.s = true;
            break;
        case 'ArrowUp':
            keys.ArrowUp = true;
            break;
        case 'ArrowDown':
            keys.ArrowDown = true;
            break;
    }
}

function keyUp(event: KeyboardEvent){
    switch(event.key){
        case 'w':
        case 'W':
            keys.w = false;
            break;
        case 's':
        case 'S':
            keys.s = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp = false;
            break;
        case 'ArrowDown':
            keys.ArrowDown = false;
            break;
    }
}

function movePaddles(){
    if(keys.w && paddle1.y > 0){
        paddle1.y -= paddleSpeed;
    }
    if(keys.s && paddle1.y < gameHeight - paddle1.height){
        paddle1.y += paddleSpeed;
    }
    if(keys.ArrowUp && paddle2.y > 0){
        paddle2.y -= paddleSpeed;
    }
    if(keys.ArrowDown && paddle2.y < gameHeight - paddle2.height){
        paddle2.y += paddleSpeed;
    }
}

function updateScore(){
    leftScoreElement.textContent = `${player1Score}`; 
    rightScoreElement.textContent = `${player2Score}`; 
}

function resetGame(){
    player1Score = 0;
    player2Score = 0

    paddle1 = {
        width:  14,
        height: 95,
        x: 25,
        y: 0
    };
    paddle2 = {
        width: 14,
        height: 95,
        x: gameWidth - 39,
        y: 0
    };
    paddle1.y = (gameHeight / 2) - (paddle1.height / 2)
    paddle2.y = (gameHeight / 2) - (paddle1.height / 2)
    ballSpeed = 1
    ballX = 0
    ballY = 0
    ballXDirection = 0
    ballYDirection = 0
    updateScore()
    clearInterval(intervalID)
    gameStart()
}
