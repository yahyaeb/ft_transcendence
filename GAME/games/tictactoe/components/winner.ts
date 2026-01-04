export function render(): string {
  return `
    <div class="text-center max-w-[700px] w-full mx-auto">
      <div class="text-9xl mb-8 animate-bounce" style="filter: drop-shadow(0 0 30px rgba(251, 191, 36, 0.8))">
        🏆
      </div>

      <div class="mb-8">
        <h1 id="winnerTitle" class="text-6xl font-extrabold mb-4 gradient-purple" 
            style="filter: drop-shadow(0 0 25px rgba(168, 139, 250, 0.6))">
          Player 1 Wins!
        </h1>
        <p class="text-2xl text-slate-400 tracking-wide">Félicitations pour cette victoire!</p>
      </div>

      <div class="bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-2xl p-8 mb-8">
        <div class="text-slate-400 text-sm uppercase tracking-wider mb-4">Score Final</div>
        <div class="flex justify-center items-center gap-8">
          <div>
            <div id="player1Name" class="text-lg text-purple-400 mb-2">Player 1</div>
            <div id="finalScore1" class="text-5xl font-extrabold gradient-purple">0</div>
          </div>

          <div class="text-3xl text-slate-600">-</div>

          <div>
            <div id="player2Name" class="text-lg text-cyan-400 mb-2">Player 2</div>
            <div id="finalScore2" class="text-5xl font-extrabold gradient-cyan">0</div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4 px-8">
        <button id="replayBtn"
                class="font-semibold text-lg cursor-pointer px-8 py-4 bg-gradient-to-br from-indigo-500 to-purple-600 border-none rounded-2xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.5)]"
                style="box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4)">
          Rejouer
        </button>
        
        <button id="menuBtn"
                class="font-semibold text-lg cursor-pointer px-8 py-4 bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-2xl text-slate-300 transition-all duration-300 hover:border-purple-500/50 hover:text-white">
          Retour au Menu
        </button>
      </div>
    </div>
  `;
}

export function onMount(): void {
  const urlParams = new URLSearchParams(window.location.search);

  const winnerParam = urlParams.get("winner"); // expect: "1" | "2" | "draw"
  const score1 = urlParams.get("score1") || "0";
  const score2 = urlParams.get("score2") || "0";
  const player1 = urlParams.get("player1") || "Player 1";
  const player2 = urlParams.get("player2") || "Guest";

  const matchId =
    urlParams.get("matchId") || sessionStorage.getItem("ttt_match_id") || "";

  // ---------- UI winner name ----------
  const winnerName =
    winnerParam === "1" ? player1 :
    winnerParam === "2" ? player2 :
    "Match nul";

  const winnerTitle = document.getElementById("winnerTitle") as HTMLElement | null;
  if (winnerTitle) {
    winnerTitle.textContent =
      winnerParam === "draw" ? "Match nul !" : `${winnerName} Gagne!`;

    if (winnerParam === "1") {
      winnerTitle.className = "text-6xl font-extrabold mb-4 gradient-purple";
      winnerTitle.style.filter = "drop-shadow(0 0 25px rgba(168, 139, 250, 0.6))";
    } else if (winnerParam === "2") {
      winnerTitle.className = "text-6xl font-extrabold mb-4 gradient-cyan";
      winnerTitle.style.filter = "drop-shadow(0 0 25px rgba(34, 211, 238, 0.6))";
    } else {
      winnerTitle.className = "text-6xl font-extrabold mb-4 text-yellow-300";
      winnerTitle.style.filter = "drop-shadow(0 0 25px rgba(251, 191, 36, 0.6))";
    }
  }

  const p1El = document.getElementById("player1Name");
  const p2El = document.getElementById("player2Name");
  const s1El = document.getElementById("finalScore1");
  const s2El = document.getElementById("finalScore2");

  if (p1El) p1El.textContent = player1;
  if (p2El) p2El.textContent = player2;
  if (s1El) s1El.textContent = score1;
  if (s2El) s2El.textContent = score2;

  const result =
    winnerParam === "1" ? "p1" :
    winnerParam === "2" ? "p2" :
    "draw"; 

  async function finishMatch(): Promise<void> {
    if (!matchId) return;

    try {
      const res = await fetch(`https://localhost:4999/matches/${matchId}/finishtic`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ result }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.warn("finishMatch failed:", data);
        return;
      }

      sessionStorage.removeItem("ttt_match_id");
    } catch (e) {
      console.warn("finishMatch error:", e);
    }
  }

  void finishMatch();

  const replayBtn = document.getElementById("replayBtn");
  replayBtn?.addEventListener("click", () => {
    window.history.pushState({}, "", "/tictactoe/gameplay");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });

   const menuBtn = document.getElementById('menuBtn');
  menuBtn?.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'https://localhost:5173/#dashboard';
  });
}
