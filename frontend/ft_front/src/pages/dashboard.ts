// src/pages/dashboard.ts
import { paintAvatars } from "../ui/avatar";

export function renderDashboard() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <div class="min-h-screen flex bg-gradient-to-br from-[#0b0f1f] to-[#1c2236] text-gray-200">

      <!-- SIDEBAR -->
      <aside class="w-64 bg-slate-800/40 backdrop-blur-xl border-r border-slate-400/10 p-6 flex flex-col gap-10">

        <!-- Game Switch -->
        <div>
          <p class="text-xs uppercase tracking-wider text-slate-400 mb-3">
            Dashboard
          </p>
          <div id="game-switch" class="flex bg-slate-900/60 rounded-full p-1">
            <button
              data-game="pong"
              class="flex-1 rounded-full py-1 text-sm font-semibold bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow">
              Pong
            </button>
            <button
              data-game="tictactoe"
              class="flex-1 rounded-full py-1 text-sm text-slate-400 hover:text-white transition">
              Tic-Tac-Toe
            </button>
          </div>
        </div>

        <!-- Menu -->
        <nav class="flex flex-col gap-4 text-slate-300">
          <button id="profileBtn" class="text-left font-medium hover:text-purple-400 transition">
            Profile
          </button>
          <button id="settingsBtn" class="text-left font-medium hover:text-purple-400 transition">
            Settings
          </button>
        </nav>

        <!-- Players list -->

          <!-- FRIENDS -->
          <p class="text-xs uppercase tracking-wider text-slate-400 mt-2 mb-2">Friends</p>
          <ul id="friends-list" class="space-y-1 max-h-40 overflow-y-auto pr-1"></ul>
          <p id="friends-empty" class="hidden text-sm text-slate-500 mt-2">
            Aucun ami. Ajoute des joueurs 👇
          </p>
        <div class="mt-8">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs uppercase tracking-wider text-slate-400">
              Players
            </p>
            <span class="text-[11px] text-slate-500"></span>
          </div>

          <div class="relative mb-4">
            <input
              id="players-search"
              type="text"
              placeholder="Search players…"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-600/20 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/15 transition"
            />
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</div>
          </div>

          <ul id="players-list" class="space-y-1 max-h-72 overflow-y-auto pr-1"></ul>


          <p id="players-empty" class="hidden text-sm text-slate-500 mt-3">
            Aucun joueur trouvé.
          </p>


          <!--
            TODO (backend):
            - Remplacer cette liste mockée par la liste réelle (amis / joueurs / demandes)
            - Brancher la recherche sur endpoint backend
            - Brancher ✓ ✕ 🚫 sur endpoints backend
          -->
        </div>

      </aside>

      <!-- MAIN -->
      <main class="flex-1 flex flex-col">

        <!-- HEADER -->
        <header class="flex justify-end items-center px-6 pt-4 pb-2">
       <button
          id="avatar-btn"
          class="w-12 h-12 rounded-full overflow-hidden bg-slate-700 hover:ring-2 hover:ring-purple-500 transition cursor-pointer"
          title="Profil"
        >
          <img data-avatar alt="avatar" class="w-full h-full object-cover" />
        </button>

        </header>

        <!-- CONTENT -->
        <section class="flex-1 px-10 pt-0">

          <h1 class="text-4xl font-semibold mb-4 mt-0 text-slate-400 tracking-wide">
            Tableau de bord
          </h1>

          <div class="flex gap-12 justify-center mb-16">

            <button id="pongBtn"
              class="relative group w-[320px] h-[180px] rounded-3xl overflow-hidden border border-slate-400/10 hover:scale-105 transition-all duration-300"
              style="background-image: url('/images/games/pong.png'); background-size: cover; background-position: center;">
              
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/20 transition"></div>

              <span class="relative z-10 flex items-center justify-center h-full text-3xl font-extrabold text-white drop-shadow-lg tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                 Pong
              </span>
            </button>

            <button id="tictactoeBtn"
              class="relative group w-[320px] h-[180px] rounded-3xl overflow-hidden border border-slate-400/10 hover:scale-105 transition-all duration-300"
              style="background-image: url('/images/games/tictactoe.png'); background-size: cover; background-position: center;">
              
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/20 transition"></div>

              <span class="relative z-10 flex items-center justify-center h-full text-3xl font-extrabold text-white drop-shadow-lg tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                 Tic Tac Toe
              </span>
            </button>

          </div>

          <section class="bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-3xl p-10">

            <div class="flex items-center justify-between mb-8">
              <h2 class="text-3xl font-bold">
                Statistiques du jeu
              </h2>
              <button
                id="stats-more-btn"
                class="text-sm text-purple-400 hover:text-purple-300 hover:underline transition">
                En savoir plus →
              </button>
            </div>

            <div class="grid grid-cols-3 gap-8 mb-10">
              <div class="bg-slate-900/60 rounded-2xl p-6 text-center">
                <p class="text-slate-400 mb-4">Victoires</p>

                <!-- Layout Pong (Classique + Tournois) -->
                <div id="wins-pong" class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs uppercase tracking-wide text-slate-500 mb-1">Classique</p>
                    <p data-stat="wins-classic" class="text-3xl font-extrabold gradient-green">12</p>
                  </div>
                  <div>
                    <p class="text-xs uppercase tracking-wide text-slate-500 mb-1">Tournois</p>
                    <p data-stat="wins-tournament" class="text-3xl font-extrabold gradient-purple">1</p>
                  </div>
                </div>

                <!-- Layout TicTacToe (Victoires simples) -->
                <div id="wins-simple" class="hidden">
                  <p data-stat="wins-total" class="text-5xl font-extrabold gradient-green">6</p>
                </div>
              </div>
              <div class="bg-slate-900/60 rounded-2xl p-6 text-center">
                <p class="text-slate-400 mb-1">Défaites</p>
                <p data-stat="defeats" class="text-4xl font-extrabold gradient-red">5</p>
              </div>
              <div class="bg-slate-900/60 rounded-2xl p-6 text-center">
                <p class="text-slate-400 mb-1">Winrate</p>
                <p data-stat="winrate" class="text-4xl font-extrabold gradient-cyan">70%</p>
              </div>
            </div>

            <div class="bg-slate-900/60 rounded-2xl p-6">
              <canvas id="statsLineChart" width="600" height="260"></canvas>
              <div class="mt-6 flex justify-center gap-6 text-sm text-slate-400">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-purple-500"></span>
                  <span>Victoires</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-cyan-400"></span>
                  <span>Défaites</span>
                </div>
              </div>
            </div>

          </section>

        </section>
      </main>
    </div>
  `;
}

export function onMountDashboard(): void {
  paintAvatars(true);

  const API_BASE = "https://localhost:4999";


  const switchButtons = document.querySelectorAll<HTMLButtonElement>(
    '#game-switch button'
  );

  let activeGame: "pong" | "tictactoe" = "pong";

  const statsMoreBtn = document.getElementById("stats-more-btn");

  const gameStats = {
    pong: {
      labels: ["J1", "J2", "J3", "J4", "J5", "J6"],
      wins: [2, 3, 5, 6, 9, 12],
      losses: [1, 1, 2, 3, 4, 5],
      victoriesClassic: 12,
      victoriesTournament: 1,
      defeats: 5,
      winrate: "70%"
    },
    tictactoe: {
      labels: ["J1", "J2", "J3", "J4", "J5", "J6"],
      wins: [1, 2, 2, 3, 4, 6],
      losses: [0, 1, 2, 2, 3, 4],
      winsTotal: 6,
      defeats: 4,
      winrate: "60%"
    }
  } as const;

  type ChartSeries = {
    labels: string[];
    wins: number[];
    losses: number[];
  };

  function renderChartSeries(series: ChartSeries) {
    const canvas = document.getElementById("statsLineChart") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxValue = Math.max(...series.wins, ...series.losses, 1);

    const padding = 40;
    const stepX = (canvas.width - padding * 2) / Math.max(series.labels.length - 1, 1);
    const stepY = (canvas.height - padding * 2) / maxValue;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // axes
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    function drawLine(values: number[], color: string) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      values.forEach((v, i) => {
        const x = padding + i * stepX;
        const y = canvas.height - padding - v * stepY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    drawLine(series.wins, "#8b5cf6");   // wins
    drawLine(series.losses, "#22d3ee"); // losses
  }



  function renderStats(gameKey: "pong" | "tictactoe") {
  const winsPong = document.getElementById("wins-pong");
  const winsSimple = document.getElementById("wins-simple");

    if (gameKey === "pong") {
      winsPong?.classList.remove("hidden");
      winsSimple?.classList.add("hidden");
      return;
    }

    // TicTacToe layout (simple)
    winsPong?.classList.add("hidden");
    winsSimple?.classList.remove("hidden");
  }


  const avatarBtn = document.getElementById("avatar-btn");

  const pongBtn = document.getElementById('pongBtn');
  const tictactoeBtn = document.getElementById('tictactoeBtn');

  avatarBtn?.addEventListener("click", () => {
    window.location.hash = "#profile";
  });

  const settingsBtn = document.getElementById("settingsBtn");

  settingsBtn?.addEventListener("click", () => {
    window.location.hash = "#settings";
  });

  const profileBtn = document.getElementById("profileBtn");

  profileBtn?.addEventListener("click", () => {
    window.location.hash = "#profile";
  });

  pongBtn?.addEventListener('click', () => {
    window.location.href = `https://localhost:5174/pong`;
  });

  tictactoeBtn?.addEventListener('click', () => {
    window.location.href = `https://localhost:5174/tictactoe`;
  });


  type PongStatsResponse = {
    userId: number;
    regularWins: number;
    tournamentWins: number;
    losses: number;
  };

  function calcWinrate(wins: number, losses: number): string {
    const total = wins + losses;
    if (total === 0) return "0%";
    return `${Math.round((wins / total) * 100)}%`;
  }

  function setText(sel: string, value: string | number) {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (el) el.textContent = String(value);
  }

  type TicStatsResponse = {
  userId: number;
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winrate: string; // "42%"
};

  async function fetchTicStats() {
    try {
      const res = await fetch(`${API_BASE}/users/me/ticstats`, {
        method: "GET",
        credentials: "include",
      });

      const data = (await res.json().catch(() => ({}))) as Partial<TicStatsResponse>;
      if (!res.ok) throw new Error((data as any)?.error ?? (data as any)?.message ?? "Tic stats load failed");

      const wins = Number(data.wins ?? 0);
      const losses = Number(data.losses ?? 0);
      const winrate = String(data.winrate ?? "0%");

      setText("[data-stat='wins-total']", wins);
      setText("[data-stat='defeats']", losses);
      setText("[data-stat='winrate']", winrate);

      renderChartSeries({
        labels: ["Start", "Now"],
        wins: [0, wins],
        losses: [0, losses],
      });
    } catch (e: any) {
      console.warn("Failed to load tic stats:", e?.message ?? e);
    }
  }

  async function fetchPongStats() {
    try {
      const res = await fetch(`${API_BASE}/users/me/stats`, {
        method: "GET",
        credentials: "include",
      });

      const data = (await res.json().catch(() => ({}))) as Partial<PongStatsResponse>;
      if (!res.ok) throw new Error((data as any)?.error ?? (data as any)?.message ?? "Stats load failed");

      const regularWins = Number(data.regularWins ?? 0);
      const tournamentWins = Number(data.tournamentWins ?? 0);
      const losses = Number(data.losses ?? 0);

      const totalWins = regularWins + tournamentWins;
      const winrate = calcWinrate(totalWins, losses);

      setText("[data-stat='wins-classic']", regularWins);
      setText("[data-stat='wins-tournament']", tournamentWins);
      setText("[data-stat='defeats']", losses);
      setText("[data-stat='winrate']", winrate);

      renderChartSeries({
        labels: ["Start", "Now"],
        wins: [0, totalWins],
        losses: [0, losses],
      });

    } catch (e: any) {
      console.warn("Failed to load pong stats:", e?.message ?? e);
    }
  }

  
  switchButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const game = btn.dataset.game as "pong" | "tictactoe";
      if (!game) return;
      activeGame = game;

      switchButtons.forEach(b => {
        b.classList.remove(
          "bg-gradient-to-br",
          "from-indigo-500",
          "to-purple-600",
          "text-white",
          "shadow"
        );
        b.classList.add("text-slate-400");
      });

      btn.classList.add(
        "bg-gradient-to-br",
        "from-indigo-500",
        "to-purple-600",
        "text-white",
        "shadow"
      );
      btn.classList.remove("text-slate-400");

      renderStats(activeGame);

      if (activeGame === "pong") {
        fetchPongStats();
      } else {
        fetchTicStats();
      }


    });
  });

  statsMoreBtn?.addEventListener("click", () => {
    if (activeGame === "pong") {
      window.location.hash = "#stats-pong";
    } else {
      window.location.hash = "#stats-tictactoe";
    }
  });


  const friendsListEl = document.getElementById("friends-list") as HTMLUListElement | null;
  const friendsEmptyEl = document.getElementById("friends-empty") as HTMLParagraphElement | null;

  const playersListEl = document.getElementById("players-list") as HTMLUListElement | null;
  const playersEmptyEl = document.getElementById("players-empty") as HTMLParagraphElement | null;

  const playersSearch = document.getElementById("players-search") as HTMLInputElement | null;

  type Player = {
    id: number;
    username: string;
    avatarUrl?: string | null;
    last_seen_at?: number | null;
  };


  const ONLINE_WINDOW_MS = 45_000;

  const isOnline = (lastSeen?: number | null) =>
    typeof lastSeen === "number" && (Date.now() - lastSeen) <= ONLINE_WINDOW_MS;

  function formatLastSeen(ms?: number | null) {
    if (typeof ms !== "number") return "";

    const diff = Date.now() - ms;
    if (diff < 0) return "just now";

    const sec = Math.floor(diff / 1000);
    if (sec < 60) return "just now";

    const min = Math.floor(sec / 60);
    if (min < 60) return `${min} min ago`;

    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;

    const day = Math.floor(hr / 24);
    return `${day}d ago`;
  }


  let friendsCache: Player[] = [];
  let usersCache: Player[] = [];
  let friendIds = new Set<number>();

  function setEmpty(el: HTMLParagraphElement | null, text: string, show: boolean) {
    if (!el) return;
    el.textContent = text;
    el.classList.toggle("hidden", !show);
  }

  function renderFriends(list: Player[]) {
    if (!friendsListEl) return;

    friendsListEl.innerHTML = list
      .map(f => {
        const online = isOnline(f.last_seen_at);
        const dotClass = online ? "bg-emerald-400" : "bg-slate-500";

        const statusText = online ? "Online" : `Last seen ${formatLastSeen(f.last_seen_at)}`;

        return `
          <li class="group flex items-center justify-between gap-3 rounded-xl px-2.5 py-2 hover:bg-slate-900/35 transition">
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div class="relative w-9 h-9 rounded-full bg-slate-900/40 border border-slate-600/20 overflow-hidden">
                <img src="${f.avatarUrl ?? "/avatars/default-avatar.png"}" class="w-full h-full object-cover" />
                <span class="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full ${dotClass} border border-slate-900"></span>
              </div>

              <div class="min-w-0">
                <p class="text-sm font-medium text-slate-200 truncate">${f.username}</p>
                <p class="text-[11px] text-slate-500">${statusText}</p>
              </div>
            </div>

            <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                data-action="Remove"
                data-user-id="${f.id}"
                title="Remove"
                class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900/40 border border-slate-600/20 text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 transition"
              >➖​</button>
            </div>
          </li>
        `;
      })
      .join("");

    setEmpty(friendsEmptyEl, "No friends Available.", list.length === 0);
  }

  function renderUsers(list: Player[]) {
    if (!playersListEl) return;

    const q = (playersSearch?.value ?? "").trim().toLowerCase();
    const filtered = q ? list.filter(u => (u.username || "").toLowerCase().includes(q)) : list;

    playersListEl.innerHTML = filtered
      .map(u => {
        const alreadyFriend = friendIds.has(u.id);
        const canShowStatus = typeof u.last_seen_at === "number";
        const online = canShowStatus && isOnline(u.last_seen_at);
        const dotClass = !canShowStatus ? "hidden" : (online ? "bg-emerald-400" : "bg-slate-500");
        const statusText = canShowStatus ? (online ? "Online" : `Last seen ${formatLastSeen(u.last_seen_at)}`) : "";

        return `
        <li class="group flex items-center gap-3 rounded-xl px-2.5 py-2 hover:bg-slate-900/35 transition">
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div class="relative w-9 h-9 rounded-full bg-slate-900/40 border border-slate-600/20 overflow-hidden">
                <img src="${u.avatarUrl ?? "/avatars/default-avatar.png"}" class="w-full h-full object-cover" />
                <span class="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full ${dotClass} border border-slate-900"></span>
              </div>

              <div class="min-w-0">
                <p class="text-sm font-medium text-slate-200 truncate">${u.username}</p>
                <p class="text-[11px] text-slate-500">${statusText}</p>
              </div>
            </div>

            <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                data-action="add"
                data-user-id="${u.id}"
                title="${alreadyFriend ? "Already friends" : "Add"}"
                class="w-3 h-3 flex items-center justify-center rounded-lg bg-slate-900/40 border border-slate-600/20 transition
                      ${alreadyFriend ? "text-slate-500 opacity-60 cursor-not-allowed" : "text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400/30 transition"}"
                ${alreadyFriend ? "disabled" : ""}
              >${alreadyFriend ? "✓" : "＋"}</button>

              <button
                type="button"
                data-action="block"
                data-user-id="${u.id}"
                title="Bloquer"
                class="w-3 h-3 flex items-center justify-center rounded-lg bg-slate-900/40 border border-slate-600/20 text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 transition"
              >🚫</button>
              <button
                type="button"
                data-action="unblock"
                data-user-id="${u.id}"
                title="Unblock"
                class="w-3 h-3 flex items-center justify-center rounded-lg bg-slate-900/40 border border-slate-600/20 text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 transition"
              >🇽</button>

            </div>
          </li>
        `;
      })
      .join("");

    setEmpty(playersEmptyEl, "Doesn't exist.", filtered.length === 0);
  }

  async function loadFriends(): Promise<Player[]> {
    const res = await fetch(`${API_BASE}/friends/friendsList`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message ?? data?.error ?? "Failed to load friends");

    const friends: Player[] = Array.isArray(data) ? data : (data.friends ?? []);
    friendsCache = friends;
    friendIds = new Set(friends.map(f => f.id));

    renderFriends(friendsCache);
    renderUsers(usersCache);

    return friends;
  }

  async function loadUsers(): Promise<Player[]> {
    const res = await fetch(`${API_BASE}/users`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message ?? data?.error ?? "Failed to load users");

    const users: Player[] = Array.isArray(data) ? data : (data.users ?? data.data ?? []);
    usersCache = users;

    renderUsers(usersCache);
    return users;
  }

  async function initFriendsUsers() {
    try {
      await loadUsers();
      await loadFriends().catch(() => {
        friendsCache = [];
        friendIds = new Set();
        renderFriends([]);
      });
    } catch (e: any) {
      friendsCache = [];
      usersCache = [];
      friendIds = new Set();
      renderFriends([]);
      renderUsers([]);
      setEmpty(playersEmptyEl, e?.message ?? "Error loading player", true);
    }
  }

  initFriendsUsers();

  playersSearch?.addEventListener("input", () => renderUsers(usersCache));

  function handleListClick(e: Event) {
    const target = e.target as HTMLElement;
    const btn = target.closest("button[data-action]") as HTMLButtonElement | null;
    if (!btn) return;

    const action = btn.dataset.action;
    const userId = Number(btn.dataset.userId);
    if (!userId) return;

    (async () => {
      try {
        if (action === "add") {
          const ok = confirm("Add this user?");
          if (!ok) return;

          if (friendIds.has(userId)) return;

          const res = await fetch(`${API_BASE}/friends/addFriend`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });

          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.message ?? data?.error ?? "Add friend failed");

          await loadFriends();
          return;
        }
        if (action === "Remove") {
          const ok = confirm("Remove this user?");
          if (!ok) return;

          const res = await fetch(`${API_BASE}/friends/blockerUser`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });

          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.message ?? data?.error ?? "Block failed");

          await loadFriends().catch(() => {});
          await loadUsers().catch(() => {});
        }
        if (action === "block") {
          const ok = confirm("Block this user?");
          if (!ok) return;

          const res = await fetch(`${API_BASE}/friends/blockerUser`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });

          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.message ?? data?.error ?? "Block failed");

          await loadFriends().catch(() => {});
          await loadUsers().catch(() => {});
        }
        if (action === "unblock") {
          const ok = confirm("Unblock this user?");
          if (!ok) return;

          const res = await fetch(`${API_BASE}/friends/unblockUser`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });

          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.message ?? data?.error ?? "Unblock failed");

          await loadFriends().catch(() => {});
          await loadUsers().catch(() => {});
          return;
        }
      } catch (err: any) {
        alert(err?.message ?? "Action failed");
      }
    })();
  }

  playersListEl?.addEventListener("click", handleListClick);
  friendsListEl?.addEventListener("click", handleListClick);

  const pingTimer = window.setInterval(() => {
    fetch(`${API_BASE}/users/me/ping`, { method: "PATCH", credentials: "include", }).catch(() => {});
  }, 20_000);

  window.addEventListener("hashchange", () => clearInterval(pingTimer), { once: true });

  renderStats(activeGame);
  if (activeGame === "pong") {
    fetchPongStats();
  } else {
    fetchTicStats();
  }

}