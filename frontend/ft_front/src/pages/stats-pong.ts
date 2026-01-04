// src/pages/pongStats.ts
import { fetchMe, getUser } from "../state/auth";

const API_BASE = "https://localhost:4999";
const HISTORY_URL = `${API_BASE}/users/me/history`;

type Match = {
  id: number;
  player1_name: string;
  player2_name: string;
  score_p1: number;
  score_p2: number;
  winner_id: number;
  created_at: string;
};

type HistoryResponse = { matches: Match[] };

function formatDate(s: string) {
  return s?.slice(0, 16) ?? "";
}

function escapeHtml(str: string) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function renderStatsPong() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <div class="min-h-screen w-full bg-gradient-to-br from-[#0b0f1f] to-[#1c2236] text-gray-200 px-6 py-10">
      <div class="max-w-5xl mx-auto">

        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-extrabold">Pong • Match History</h1>
          <a href="#dashboard" class="text-sm text-purple-300 hover:underline">← Back</a>
        </div>

        <div class="bg-slate-800/40 backdrop-blur-xl border border-slate-400/10 rounded-3xl p-6">
          <div class="flex items-center justify-between mb-4">
            <p class="text-slate-400 text-sm">Latest matches</p>
            <p id="history-count" class="text-slate-500 text-xs"></p>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="text-slate-400">
                <tr class="border-b border-slate-700/40">
                  <th class="text-left py-3 pr-4">Date</th>
                  <th class="text-left py-3 pr-4">Opponent</th>
                  <th class="text-left py-3 pr-4">Score</th>
                  <th class="text-left py-3 pr-2">Result</th>
                </tr>
              </thead>

              <tbody id="history-body" class="text-slate-200">
                <tr>
                  <td class="py-4 text-slate-500" colspan="4">Loading…</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p id="history-empty" class="hidden mt-4 text-sm text-slate-500">
            No matches yet.
          </p>

          <p id="history-error" class="hidden mt-4 text-sm text-red-400"></p>
        </div>
      </div>
    </div>
  `;
}

export function onMountStatsPong() {
  (async () => {
    const me = (await fetchMe()) ?? getUser();
    if (!me) {
      window.location.hash = "#login";
      return;
    }

    const myId = Number(me.id);
    const myName = String(me.username ?? "");

    const tbody = document.getElementById("history-body") as HTMLTableSectionElement | null;
    const emptyEl = document.getElementById("history-empty");
    const errEl = document.getElementById("history-error");
    const countEl = document.getElementById("history-count");

    const showError = (msg: string) => {
      if (errEl) {
        errEl.textContent = msg;
        errEl.classList.remove("hidden");
      }
    };

    try {
      const res = await fetch(HISTORY_URL, {
        method: "GET",
        credentials: "include",
      });

      const data = (await res.json().catch(() => ({}))) as Partial<HistoryResponse>;
      if (!res.ok) throw new Error((data as any)?.error ?? (data as any)?.message ?? "History load failed");

      const matches = Array.isArray(data.matches) ? data.matches : [];

      if (countEl) countEl.textContent = `${matches.length} match(es)`;
      if (!tbody) return;

      if (matches.length === 0) {
        tbody.innerHTML = "";
        emptyEl?.classList.remove("hidden");
        return;
      }

      emptyEl?.classList.add("hidden");
      errEl?.classList.add("hidden");

      tbody.innerHTML = matches
        .map((m) => {
          const iAmP1 = m.player1_name === myName;

          const myScore = iAmP1 ? m.score_p1 : m.score_p2;
          const oppScore = iAmP1 ? m.score_p2 : m.score_p1;
          const opponent = iAmP1 ? m.player2_name : m.player1_name;

          const isWin = Number.isFinite(myId) ? (m.winner_id === myId) : (myScore > oppScore);

          const resultText = isWin ? "WIN" : "LOSS";
          const resultClass = isWin ? "text-emerald-400" : "text-red-400";

          return `
            <tr class="border-b border-slate-700/30 hover:bg-slate-900/25 transition">
              <td class="py-3 pr-4 text-slate-300">${escapeHtml(formatDate(m.created_at))}</td>
              <td class="py-3 pr-4">${escapeHtml(opponent)}</td>
              <td class="py-3 pr-4 font-semibold">${myScore} - ${oppScore}</td>
              <td class="py-3 pr-2 font-bold ${resultClass}">${resultText}</td>
            </tr>
          `;
        })
        .join("");
    } catch (e: any) {
      if (tbody) tbody.innerHTML = "";
      emptyEl?.classList.add("hidden");
      showError(e?.message ?? "Failed to load history");
    }
  })();
}
