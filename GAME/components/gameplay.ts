export function render(): string {
  return `
    <div id="gameContainer" class="text-center max-w-[1100px] w-full mx-auto">
      <div id="topBar" class="flex justify-between items-center mb-6 px-10 py-[18px] bg-slate-800/40 rounded-xl backdrop-blur-xl border border-slate-400/10">
        <div class="playerSection flex flex-col gap-1.5">
          <div class="text-[13px] text-slate-400 uppercase tracking-wider font-medium">Player</div>
          <div id="player1Name" class="text-lg font-semibold text-purple-400">● Player 1</div>
          <div id="leftScore" class="text-[44px] font-extrabold tracking-tight gradient-purple">0</div>
        </div>
        <div class="text-4xl" style="filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))">🏆</div>
        <div class="playerSection flex flex-col gap-1.5">
          <div class="text-[13px] text-slate-400 uppercase tracking-wider font-medium">Player</div>
          <div id="player2Name" class="text-lg font-semibold text-cyan-400">● Player 2</div>
          <div id="rightScore" class="text-[44px] font-extrabold tracking-tight gradient-cyan">0</div>
        </div>
      </div>
      <div class="flex justify-center">
        <canvas id="gameBoard" width="1000" height="500" 
                class="border-2 border-slate-600/30 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800"></canvas>
      </div>
      <div class="flex justify-center gap-4 mt-[18px]">
        <button id="resetButton"
                class="font-semibold text-[15px] cursor-pointer px-9 py-[11px] bg-gradient-to-br from-indigo-500 to-purple-600 border-none rounded-[20px] text-white transition-all duration-250 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] active:translate-y-0"
                style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35)">
          Redémarrer
        </button>
        <button id="menuButton"
                class="font-semibold text-[15px] cursor-pointer px-9 py-[11px] bg-gradient-to-br from-indigo-500 to-purple-600 border-none rounded-[20px] text-white transition-all duration-250 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] active:translate-y-0"
                style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35)">
          Retour au menu
        </button>
      </div>
    </div>
  `;
}
let cleanupFunction: (()=> void) | null = null
export function onMount(): void {
  if (cleanupFunction){
    cleanupFunction()
  }
  const gameBoard = document.querySelector('#gameBoard') as HTMLCanvasElement;
  const ctx = gameBoard.getContext("2d")!;
  const leftScoreElement = document.querySelector('#leftScore')!;
  const rightScoreElement = document.querySelector('#rightScore')!;
  const resetButton = document.querySelector('#resetButton')!;
  const menuButton = document.querySelector('#menuButton')!;
  const player1NameElement = document.querySelector('#player1Name')!;
  const player2NameElement = document.querySelector('#player2Name')!;
  const tournamentData = sessionStorage.getItem('tournamentData');
  const tournamentMatch = sessionStorage.getItem('currentMatch');

  const aiGame = localStorage.getItem('ai');
  let player1Name = 'Player 1';
  let player2Name = 'Player 2';
  const player3Name = "player3";
  const player4Name = "player4";

  if (aiGame === 'isAi')
      player2Name = 'AI'
  
  if (tournamentMatch) {
    if (tournamentData) {
      const data = JSON.parse(tournamentData);
      if (tournamentMatch === '1') {
        player1Name = data.players[0];
        player2Name = data.players[1];
      } else if (tournamentMatch === '2') {
        player1Name = data.players[2];
        player2Name = data.players[3];
      } else if (tournamentMatch === 'final') {
        player1Name = sessionStorage.getItem('match1Winner') || 'Winner 1';
        player2Name = sessionStorage.getItem('match2Winner') || 'Winner 2';
      }
    }
  }

  player1NameElement.textContent = `${player1Name}`;
  player2NameElement.textContent = `${player2Name}`;
  const gameWidth = gameBoard.width;
  const gameHeight = gameBoard.height;
  const boardBackground = "#0f172a";
  const paddle1Color = "#a78bfa";
  const paddle2Color = "#22d3ee";
  const paddleBorder = "transparent";
  const ballColor = "#f8fafc";
  const ballBorderColor = "rgba(248, 250, 252, 0.25)";
  const ballRadius = 8.5;
  const maxBallSpeed = 2.5;
  const paddleSpeed = 3.5;
  let intervalID: number;
  let ballSpeed: number;
  let ballX = gameWidth / 2;
  let ballY = gameHeight / 2;
  let ballXDirection = 0;
  let ballYDirection = 0;
  let player1Score = 0;
  let player2Score = 0;
  let aiTargetY = gameHeight / 2
  let aiReactionTimer = Date.now()
  const aiReactionDelay = 1000

  let keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
  };

  let paddle1 = {
    width: 10,
    height: 95,
    x: 25,
    y: 0
  };

  let paddle2 = {
    width: 10,
    height: 95,
    x: gameWidth - 39,
    y: 0
  };

  let ai = {
    X: gameWidth / 2,
    Y: gameHeight / 2,
    XDirection: 0,
    YDirection: 0,
    Speed: 1.5
  };

  paddle1.y = (gameHeight / 2) - (paddle1.height / 2);
  paddle2.y = (gameHeight / 2) - (paddle1.height / 2);

  let gameActive = true;

  function cleanup() {
    gameActive = false;
    clearTimeout(intervalID);
    window.removeEventListener("keydown", keyDown);
    window.removeEventListener("keyup", keyUp);
  }
  cleanupFunction = cleanup;
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  resetButton.addEventListener("click", resetGame);

  gameStart();

  function gameStart(){
    createBall();
    nextTick();
  }

  function nextTick(){
    if (!gameActive) return;
    intervalID = setTimeout(() => {
        if (!gameActive) return;
        clearBoard();
        drawCenterLine();
        drawPaddles();
        movePaddles();
        moveBall();
        checkCollision();
        drawBall(ballX, ballY);
        nextTick();
    }, 0.06);
  }

  function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
  }

  function drawCenterLine(){
    ctx.strokeStyle = "rgba(100, 116, 139, 0.25)";
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 12]);
    ctx.moveTo(gameWidth / 2, 0);
    ctx.lineTo(gameWidth / 2, gameHeight);
    ctx.stroke();

    ctx.strokeStyle = "rgba(100, 116, 139, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(gameWidth / 2, gameHeight / 2, 150, 0, 10 * Math.PI);
    ctx.stroke();
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
    ballSpeed = 1.5;
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
        ballSpeed = maxBallSpeed;
    ballX += (ballSpeed * ballXDirection);
    ballY += (ballSpeed * ballYDirection);
  }

  function checkCollision(){
    if (ballY <= 0 + ballRadius)
            ballYDirection *= -1;
    if (ballY >= (gameHeight - ballRadius))
            ballYDirection *=  -1;
    if (ballX <= 0){
            player2Score += 1;
            updateScore();
            if (player2Score === 5 ){
                cleanup();

                if (tournamentMatch){
                    if (tournamentMatch === '1'){
                        sessionStorage.setItem('match1Winner', player2Name);
                        sessionStorage.setItem('match1Score', JSON.stringify({
                            player1: player1Score,
                            player2: player2Score
                        }));
                        window.history.pushState({}, '', `/tournament-match-winner?winner=2&score1=${player1Score}&score2=${player2Score}&player1=${encodeURIComponent(player1Name)}&player2=${encodeURIComponent(player2Name)}`);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                        return;
                    }
                    else if (tournamentMatch === '2'){
                        sessionStorage.setItem('match2Winner', player2Name);
                        sessionStorage.setItem('match2Score', JSON.stringify({
                            player1: player1Score,
                            player2: player2Score
                        }));
                        window.history.pushState({}, '', `/tournament-match-winner?winner=2&score1=${player1Score}&score2=${player2Score}&player1=${encodeURIComponent(player1Name)}&player2=${encodeURIComponent(player2Name)}`);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                        return;
                    }
                    else if (tournamentMatch === 'final'){
                        window.history.pushState({}, '', `/winner?winner=2&score1=${player1Score}&score2=${player2Score}&player1=${encodeURIComponent(player1Name)}&player2=${encodeURIComponent(player2Name)}`);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                        return;
                    }
                }
                else {
                    window.history.pushState({}, '', `/winner?winner=2&score1=${player1Score}&score2=${player2Score}&player1=${encodeURIComponent(player1Name)}&player2=${encodeURIComponent(player2Name)}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }
                return;
            }
            createBall();
            return;
    }
    if (ballX >= gameWidth){
        player1Score += 1;
        updateScore();
        if (player1Score === 5){
            cleanup();

            if (tournamentMatch){
                if (tournamentMatch === '1'){
                    sessionStorage.setItem('match1Winner', player1Name);
                    sessionStorage.setItem('match1Score', JSON.stringify({
                        player1: player1Score,
                        player2: player2Score
                    }));
                    window.history.pushState({}, '', `/tournament-match-winner?winner=1&score1=${player1Score}&score2=${player2Score}&player1=${encodeURIComponent(player1Name)}&player2=${encodeURIComponent(player2Name)}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    return;
                }
                else if (tournamentMatch === '2'){
                    sessionStorage.setItem('match2Winner', player1Name);
                    sessionStorage.setItem('match2Score', JSON.stringify({
                        player1: player1Score,
                        player2: player2Score
                    }));
                    window.history.pushState({}, '', `/tournament-match-winner?winner=1&score1=${player1Score}&score2=${player2Score}&player1=${encodeURIComponent(player1Name)}&player2=${encodeURIComponent(player2Name)}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    return;
                }
                else if (tournamentMatch === 'final'){
                    window.history.pushState({}, '', `/winner?winner=1&score1=${player1Score}&score2=${player2Score}&player1=${encodeURIComponent(player1Name)}&player2=${encodeURIComponent(player2Name)}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    return;
                }
            }
            else {
                window.history.pushState({}, '', `/winner?winner=1&score1=${player1Score}&score2=${player2Score}&player1=${encodeURIComponent(player1Name)}&player2=${encodeURIComponent(player2Name)}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
            }
            return ;
        }
        createBall();
        return;
    }
    if (ballX <= (paddle1.x + paddle1.width + ballRadius)){
        if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height){
                ballX = (paddle1.x + paddle1.width) + ballRadius;
                ballXDirection *= -1;
                ballSpeed += 0.35;
            let collidePoint = ballY - (paddle1.y + paddle1.height / 2);
            collidePoint = collidePoint / (paddle1.height / 2);
            let angleRad = (Math.PI / 3) * collidePoint;
            ballYDirection = Math.sin(angleRad) * 1.5;
        }
    }
    if (ballX >= (paddle2.x - ballRadius)){
        if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height){
                ballX = paddle2.x - ballRadius;
                ballXDirection *= -1;
                ballSpeed += 0.35;
            let collidePoint = ballY - (paddle2.y + paddle2.height / 2);
            collidePoint = collidePoint / (paddle2.height / 2);
            let angleRad = (Math.PI / 3) * collidePoint;
            ballYDirection = Math.sin(angleRad) * 1.5;
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

  function snapshot(){
    ai.X = ballX
    ai.Y = ballY
    ai.XDirection = ballXDirection
    ai.YDirection = ballYDirection
    ai.Speed = ballSpeed
  }

  function predictBallY(): number{
    if (ai.XDirection < 0)
      return gameHeight / 2

    let simY = ai.Y
    let simX = ai.X
    let simYDirection = ai.YDirection
    let simSpeed = ai.Speed

    if (simSpeed > maxBallSpeed)
      simSpeed = maxBallSpeed
    const targetX = paddle2.x - ballRadius

    while (simX < targetX){
      simX += simSpeed * ai.XDirection
      simY += simSpeed * simYDirection

      if (simY <= ballRadius){
        simY = ballRadius
        simYDirection *= -1
      }
      if (simY >= gameHeight - ballRadius){
        simY = gameHeight - ballRadius
        simYDirection *= -1
      }
    }
    return simY
  }

  let aiPredictedY = gameHeight / 2
  let aiErrorMargin = 0

  function movePaddles(){
    if(keys.w && paddle1.y > 0){
        paddle1.y -= paddleSpeed;
    }
    if(keys.s && paddle1.y < gameHeight - paddle1.height){
        paddle1.y += paddleSpeed;
    }
    if (aiGame !== 'isAi')
    {
      if(keys.ArrowUp && paddle2.y > 0){
          paddle2.y -= paddleSpeed;
      }
      if(keys.ArrowDown && paddle2.y < gameHeight - paddle2.height){
          paddle2.y += paddleSpeed;
      }

    }
    else{
      let currentTime = Date.now()
      if (currentTime - aiReactionTimer >= aiReactionDelay){
        snapshot()
        const perfectPrediction = predictBallY()
        aiErrorMargin = (Math.random() - 0.5) * 200
        aiPredictedY = perfectPrediction + aiErrorMargin
        if (aiPredictedY < 0)
          aiPredictedY = 0
        if (aiPredictedY > gameHeight)
            aiPredictedY = gameHeight
        aiReactionTimer = currentTime
      }
      const paddleCenter = paddle2.y + paddle2.height / 2
      keys.ArrowUp = false
      keys.ArrowDown = false
      if (aiPredictedY > paddleCenter + 15)
        keys.ArrowDown = true
      else if (aiPredictedY < paddleCenter - 15)
        keys.ArrowUp = true
      if (keys.ArrowUp && paddle2.y > 0 && ballX >= gameWidth / 2){
        paddle2.y -= paddleSpeed
      }
      if (keys.ArrowDown && paddle2.y < gameHeight - paddle2.height && ballX >= gameWidth / 2){
        paddle2.y += paddleSpeed
      }
    }
  }

  function updateScore(){
    leftScoreElement.textContent = `${player1Score}`; 
    rightScoreElement.textContent = `${player2Score}`; 
  }

  function resetGame(){
    player1Score = 0;
    player2Score = 0;

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
    paddle1.y = (gameHeight / 2) - (paddle1.height / 2);
    paddle2.y = (gameHeight / 2) - (paddle1.height / 2);
    ballSpeed = 1;
    ballX = 0;
    ballY = 0;
    ballXDirection = 0;
    ballYDirection = 0;
    updateScore();
    clearTimeout(intervalID);
    gameStart();
  }


  const menuClickHandler = () => {
    localStorage.removeItem('ai');
    cleanup();
    window.history.pushState({}, '', '/mainPage');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  
  menuButton.addEventListener("click", menuClickHandler);
}
