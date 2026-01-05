export function render(): string {
  return `
    <div id="gameContainer" class="text-center max-w-[700px] w-full mx-auto">
      <div id="topBar" class="flex justify-between items-center mb-6 px-10 py-[18px] bg-slate-800/40 rounded-xl backdrop-blur-xl border border-slate-400/10">
        <div class="playerSection flex flex-col gap-1.5 relative">
          <div id="player1Arrow" class="absolute -left-6 top-1/2 -translate-y-1/2 text-3xl gradient-purple opacity-0 transition-opacity duration-300">→</div>
          <div class="text-[13px] text-slate-400 uppercase tracking-wider font-medium">Joueur X</div>
          <div id="player1Name" class="text-lg font-semibold text-purple-400">Player 1</div>
          <div id="player1Score" class="text-[32px] font-extrabold tracking-tight gradient-purple">0</div>
        </div>
        <div class="flex flex-col items-center">
          <div id="drawScore" class="text-slate-400">
            <span class="text-sm">Nuls: </span>
            <span id="drawCount" class="font-bold">0</span>
          </div>
        </div>
        <div class="playerSection flex flex-col gap-1.5 relative">
          <div id="player2Arrow" class="absolute -right-6 top-1/2 -translate-y-1/2 text-3xl gradient-cyan opacity-0 transition-opacity duration-300">←</div>
          <div class="text-[13px] text-slate-400 uppercase tracking-wider font-medium">Joueur O</div>
          <div id="player2Name" class="text-lg font-semibold text-cyan-400">Player 2</div>
          <div id="player2Score" class="text-[32px] font-extrabold tracking-tight gradient-cyan">0</div>
        </div>
      </div>
      
      <div class="flex justify-center mb-6">
        <canvas id="gameBoard" width="450" height="450" 
                class="border-2 border-slate-600/30 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 cursor-pointer"></canvas>
      </div>
      
      <div class="flex justify-center gap-4">
        <button id="resetButton"
                class="font-semibold text-[15px] cursor-pointer px-9 py-[11px] bg-gradient-to-br from-indigo-500 to-purple-600 border-none rounded-[20px] text-white transition-all duration-250 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] active:translate-y-0"
                style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35)">
          Nouvelle partie
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
let cleanupFunction: (() => void) | null = null;

async function startMatchTicTac(guestName: string): Promise<string | null> {
  const existing = sessionStorage.getItem("ttt_match_id");
  if (existing) return existing;

  try {
    const res = await fetch("https://localhost:4999/matches/starttic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ guest_name: guestName }),
    });

    const data = await res.json().catch(() => ({} as any));
    if (!res.ok) {
      console.warn("startMatch failed:", data);
      return null;
    }

    const id = String(data.id ?? data.match?.id ?? "");
    if (!id) return null;

    sessionStorage.setItem("ttt_match_id", id);
    sessionStorage.setItem("ttt_guest_name", guestName);
    return id;
  } catch (e) {
    console.warn("startMatch error:", e);
    return null;
  }
}

export function onMount(): void {
  if (cleanupFunction) cleanupFunction();

  const gameBoard = document.querySelector("#gameBoard") as HTMLCanvasElement | null;
  if (!gameBoard) return;

  const ctx = gameBoard.getContext("2d");
  if (!ctx) return;

  const player1NameElement = document.querySelector("#player1Name") as HTMLElement | null;
  const player2NameElement = document.querySelector("#player2Name") as HTMLElement | null;
  const player1ScoreElement = document.querySelector("#player1Score") as HTMLElement | null;
  const player2ScoreElement = document.querySelector("#player2Score") as HTMLElement | null;
  const drawCountElement = document.querySelector("#drawCount") as HTMLElement | null;
  const player1ArrowElement = document.querySelector("#player1Arrow") as HTMLElement | null;
  const player2ArrowElement = document.querySelector("#player2Arrow") as HTMLElement | null;
  const resetButton = document.querySelector("#resetButton") as HTMLButtonElement | null;
  const menuButton = document.querySelector("#menuButton") as HTMLButtonElement | null;

  if (
    !player1NameElement ||
    !player2NameElement ||
    !player1ScoreElement ||
    !player2ScoreElement ||
    !drawCountElement ||
    !player1ArrowElement ||
    !player2ArrowElement ||
    !resetButton ||
    !menuButton
  ) {
    console.warn("TicTacToe: missing DOM elements");
    return;
  }

  async function getMe() {
    const res = await fetch("https://localhost:4999/users/me", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  }

  (async () => {
    const me = await getMe();
    if (!me || !me.user) {
      window.location.hash = "#login";
      return;
    }

    const player1Name = String(me.user.username ?? "Player 1");
    localStorage.setItem("tictactoe_player1", player1Name);

    const player2Name = localStorage.getItem("tictactoe_pvpPlayer2") || "Guest";

    player1NameElement.textContent = player1Name;
    player2NameElement.textContent = player2Name;

    const matchId = await startMatchTicTac(player2Name);
    console.log("TTT matchId:", matchId);

  interface GameCustomization {
    xColor: string;
    oColor: string;
    boardBackground: string;
    gridColor: string;
    mapStyle: string;
  }

  const defaultGameCustomization: GameCustomization = {
    xColor: '#a78bfa',
    oColor: '#22d3ee',
    boardBackground: '#0f172a',
    gridColor: 'rgba(100, 116, 139, 0.4)',
    mapStyle: 'classic'
  };

  let customization: GameCustomization = { ...defaultGameCustomization };
  const savedCustomization = localStorage.getItem('tictactoeCustomization');
  if (savedCustomization) {
    try {
      customization = { ...defaultGameCustomization, ...JSON.parse(savedCustomization) };
    } catch (e) {
      customization = { ...defaultGameCustomization };
    }
  }

  const gameWidth = gameBoard.width;
  const gameHeight = gameBoard.height;
  const cellSize = gameWidth / 3;
  const boardBackground = customization.boardBackground;
  const gridColor = customization.gridColor;
  const xColor = customization.xColor;
  const oColor = customization.oColor;

  let board: (string | null)[] = Array(9).fill(null);
  let currentPlayer: 'X' | 'O' = 'X';
  let gameActive = true;
  let player1Score = 0;
  let player2Score = 0;
  let drawCount = 0;

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  function drawBoard() {
    if (!ctx) return;
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(cellSize, 20);
    ctx.lineTo(cellSize, gameHeight - 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cellSize * 2, 20);
    ctx.lineTo(cellSize * 2, gameHeight - 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(20, cellSize);
    ctx.lineTo(gameWidth - 20, cellSize);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(20, cellSize * 2);
    ctx.lineTo(gameWidth - 20, cellSize * 2);
    ctx.stroke();

    for (let i = 0; i < 9; i++) {
      if (board[i]) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = col * cellSize + cellSize / 2;
        const y = row * cellSize + cellSize / 2;
        
        if (board[i] === 'X') {
          drawX(x, y);
        } else {
          drawO(x, y);
        }
      }
    }
  }

  function drawX(centerX: number, centerY: number) {
    const padding = 35;
    const halfSize = cellSize / 2 - padding;
    if (!ctx) return;
    ctx.shadowBlur = 15;
    ctx.shadowColor = xColor;
    ctx.strokeStyle = xColor;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(centerX - halfSize, centerY - halfSize);
    ctx.lineTo(centerX + halfSize, centerY + halfSize);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX + halfSize, centerY - halfSize);
    ctx.lineTo(centerX - halfSize, centerY + halfSize);
    ctx.stroke();

    ctx.shadowBlur = 0;
  }

  function drawO(centerX: number, centerY: number) {
    const padding = 35;
    const radius = cellSize / 2 - padding;
    if (!ctx) return;
    ctx.shadowBlur = 15;
    ctx.shadowColor = oColor;
    ctx.strokeStyle = oColor;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.shadowBlur = 0;
  }

  function drawWinningLine(combo: number[]) {
    const startCell = combo[0];
    const endCell = combo[2];
    
    const startRow = Math.floor(startCell / 3);
    const startCol = startCell % 3;
    const endRow = Math.floor(endCell / 3);
    const endCol = endCell % 3;
    
    const startX = startCol * cellSize + cellSize / 2;
    const startY = startRow * cellSize + cellSize / 2;
    const endX = endCol * cellSize + cellSize / 2;
    const endY = endRow * cellSize + cellSize / 2;

    const winColor = board[combo[0]] === 'X' ? xColor : oColor;
    if (!ctx) return;
    
    ctx.shadowBlur = 20;
    ctx.shadowColor = winColor;
    ctx.strokeStyle = winColor;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.shadowBlur = 0;
  }

  function checkWinner(): { winner: string | null; combo: number[] | null } {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], combo };
      }
    }
    return { winner: null, combo: null };
  }

  function checkDraw(): boolean {
    return board.every(cell => cell !== null);
  }

  function updateTurnIndicator() {
    if (!player1ArrowElement || !player2ArrowElement) return;
    if (currentPlayer === 'X') {
      player1ArrowElement.classList.remove('opacity-0');
      player1ArrowElement.classList.add('opacity-100');
      player2ArrowElement.classList.remove('opacity-100');
      player2ArrowElement.classList.add('opacity-0');
    } else {
      player2ArrowElement.classList.remove('opacity-0');
      player2ArrowElement.classList.add('opacity-100');
      player1ArrowElement.classList.remove('opacity-100');
      player1ArrowElement.classList.add('opacity-0');
    }
  }

  function updateScores() {
    if (!player1ScoreElement || !player2ScoreElement || !drawCountElement) return;
    player1ScoreElement.textContent = `${player1Score}`;
    player2ScoreElement.textContent = `${player2Score}`;
    drawCountElement.textContent = `${drawCount}`;
  }

  function handleClick(event: MouseEvent) {
    if (!gameActive||!gameBoard) return;

    const rect = gameBoard.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    const index = row * 3 + col;

    if (board[index] !== null) return;

    board[index] = currentPlayer;
    drawBoard();

    const { winner, combo } = checkWinner();
    if (winner) {
      gameActive = false;
      if (combo) drawWinningLine(combo);
      
      if (winner === 'X') {
        player1Score++;
      } else {
        player2Score++;
      }
      updateScores();

      setTimeout(() => {
        if (winner === 'X') {
          navigateToWinner('1', player1Score, player2Score, player1Name, player2Name);
        } else {
          navigateToWinner('2', player1Score, player2Score, player1Name, player2Name);
        }
      }, 1500);
      return;
    }

    if (checkDraw()) {
      gameActive = false;
      drawCount++;
      updateScores();
      if (!player1ArrowElement || !player2ArrowElement) return;
      player1ArrowElement.classList.add('opacity-0');
      player2ArrowElement.classList.add('opacity-0');
      setTimeout(() => {
        navigateToWinner("draw", player1Score, player2Score, player1Name, player2Name);
      }, 1200);
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator();
  }

  function navigateToWinner(
    winner: "1" | "2" | "draw",
    score1: number,
    score2: number,
    p1Name: string,
    p2Name: string
  ) {
    cleanup();
    window.history.pushState(
      {},
      "",
      `/tictactoe/winner?winner=${winner}&score1=${score1}&score2=${score2}` +
        `&player1=${encodeURIComponent(p1Name)}&player2=${encodeURIComponent(p2Name)}`
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  }


  function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    updateTurnIndicator();
    drawBoard();
  }

  function cleanup() {
    gameActive = false;
    if (!gameBoard) return;
    gameBoard.removeEventListener('click', handleClick);
    window.removeEventListener('popstate', handlePopState);
  }

  const handlePopState = () => {
    cleanup();
  };

  const handleLogoutEvent = (e: StorageEvent) => {
    if (e.key === 'logout-event') {
      clearInterval(authCheckInterval);
      window.removeEventListener('storage', handleLogoutEvent);
      gameActive = false;
      window.location.replace('https://localhost:5173/#login');
    }
  };

  const authCheckInterval = setInterval(async () => {
    const res = await fetch('https://localhost:4999/users/me', {
      credentials: 'include',
    }).catch(() => null);
    
    if (!res || !res.ok) {
      clearInterval(authCheckInterval);
      window.removeEventListener('storage', handleLogoutEvent);
      gameActive = false;
      window.location.replace('https://localhost:5173/#login');
    }
  }, 2000);

  cleanupFunction = () => {
    clearInterval(authCheckInterval);
    window.removeEventListener('storage', handleLogoutEvent);
    cleanup();
  };

  gameBoard.addEventListener('click', handleClick);
  window.addEventListener('popstate', handlePopState);
  window.addEventListener('storage', handleLogoutEvent);

  resetButton.addEventListener('click', resetGame);

  menuButton.addEventListener('click', () => {
    cleanup();
    window.history.pushState({}, '', '/tictactoe');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

    drawBoard();
    updateTurnIndicator();
  })().catch((e) => console.error("TTT init crashed:", e));
}

