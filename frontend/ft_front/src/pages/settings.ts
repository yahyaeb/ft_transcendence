// import { json } from "node:stream/consumers";
import { getUser, fetchMe, setAvatarUrl } from "../state/auth";
import { paintAvatars } from "../ui/avatar";

const API_BASE = `https://localhost:4999`;

export function renderSettings() {
  const app = document.getElementById("app");
  if (!app) return;

  // Sécurité SPA : si non connecté, on ne devrait jamais arriver ici
  const user = getUser();
  if (!user) {
    window.location.hash = "#login";
    return;
  }

  const is2faEnabled = !!user?.two_factor_enabled; 

  app.innerHTML = `
    <div class="min-h-screen w-full bg-gradient-to-br from-[#0b0f1f] to-[#1c2236] text-gray-200 flex justify-center px-6 py-16">

      <div class="w-full max-w-2xl bg-slate-800/40 backdrop-blur-xl border border-slate-400/20 rounded-3xl p-10 shadow-2xl">

        <!-- Title -->
        <h1 class="text-4xl font-extrabold mb-10 gradient-purple"
            style="filter: drop-shadow(0 0 20px rgba(168,139,250,0.5))">
          Settings
        </h1>

        <!-- AVATAR SECTION -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold mb-4">Avatar</h2>

          <div class="relative w-24 h-24">
            <img
              id="avatar-img"
              data-avatar
              alt="avatar"
              class="w-full h-full rounded-full object-cover"
            />

            <button
              id="upload-avatar-btn"
              title="Changer l’avatar"
              class="absolute bottom-0 right-0 z-10
                    w-8 h-8 rounded-full
                    bg-gradient-to-br from-indigo-500 to-purple-600
                    text-white flex items-center justify-center
                    text-xl font-bold shadow-lg hover:scale-110 transition">
              +
            </button>

            <input
              id="avatar-file-input"
              type="file"
              accept="image/*"
              class="hidden"
            />
          </div>
        </section>


        <!-- USERNAME SECTION -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold mb-4">Username</h2>

          <div class="space-y-3">
            <input
              id="username-input"
              type="text"
              placeholder="Username"
              value="${user?.username ?? ""}"
              class="w-full px-5 py-4 bg-slate-900/60 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition"
            />

            <div class="flex items-center gap-3">
              <button
                type="button"
                id="change-username-btn"
                class="px-5 py-3 rounded-xl bg-slate-700/60 border border-slate-500/20 text-white font-semibold hover:bg-slate-700 transition"
              >
                Change
              </button>
              <p id="username-msg" class="text-sm text-slate-400"></p>
            </div>
          </div>
        </section>

        <!-- PASSWORD SECTION -->
        <section class="mb-12">
          <h2 class="text-xl font-semibold mb-4">Current password</h2>

          <div class="space-y-3">

            <!-- Old password -->
            <div class="relative">
              <input
                id="old-password-input"
                type="password"
                placeholder="Current password"
                class="w-full px-5 py-4 pr-14 bg-slate-900/60 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition"
              />
            </div>

            <!-- New password -->
            <div class="relative">
              <input
                id="new-password-input"
                type="password"
                placeholder="New password"
                class="w-full px-5 py-4 pr-14 bg-slate-900/60 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition"
              />

              <button
                type="button"
                id="toggle-password-btn"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-400 transition"
                title="Hide / Show password">

                <svg id="eye-open" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5
                      c4.478 0 8.268 2.943 9.542 7
                      -1.274 4.057-5.064 7-9.542 7
                      -4.477 0-8.268-2.943-9.542-7z" />
                </svg>

                <svg id="eye-closed" xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 hidden" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19
                      c-4.478 0-8.268-2.943-9.543-7
                      a9.97 9.97 0 012.042-3.368" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6.223 6.223A9.969 9.969 0 0112 5
                      c4.478 0 8.268 2.943 9.543 7
                      a9.97 9.97 0 01-4.132 5.411" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3l18 18" />
                </svg>
              </button>
            </div>

            <!-- Confirm new password -->
            <div class="relative">
              <input
                id="new-password-confirm-input"
                type="password"
                placeholder="Confirm new password"
                class="w-full px-5 py-4 pr-14 bg-slate-900/60 border border-slate-600/30 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition"
              />
            </div>

            <!-- Change button + message -->
            <div class="flex items-center gap-3 pt-2">
              <button
                type="button"
                id="change-password-btn"
                class="px-5 py-3 rounded-xl bg-slate-700/60 border border-slate-500/20 text-white font-semibold hover:bg-slate-700 transition"
              >
                Change
              </button>
              <p id="password-msg" class="text-sm text-slate-400"></p>
            </div>

          </div>
        </section>


          <!-- TODO BACKEND -->
          <!--
            Ici :
            - vérifier la sécurité du mot de passe
            - envoyer au backend (PATCH /users/password)
          -->
        </section>

          <!-- 2FA SECTION -->
              <section class="mb-12">
                <h2 class="text-xl font-semibold mb-4">Two-Factor Authentication (2FA)</h2>

                <div class="p-5 rounded-2xl bg-slate-900/50 border border-slate-600/20">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="font-semibold">
                        Status:
                        <span id="twofa-status" class="${is2faEnabled ? "text-emerald-400" : "text-slate-400"}">
                          ${is2faEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </p>
                      <p class="text-sm text-slate-400 mt-1">
                        Use an authenticator app (Google Authenticator, Authy, etc.).
                      </p>
                    </div>

                    <div class="flex gap-3">
                      <button
                        id="twofa-enable-btn"
                        class="px-5 py-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold transition disabled:opacity-50"
                        ${is2faEnabled ? "disabled" : ""}>
                        Enable
                      </button>

                      <button
                        id="twofa-disable-btn"
                        class="px-5 py-3 rounded-xl bg-slate-700/60 border border-slate-500/20 text-white font-semibold hover:bg-slate-700 transition disabled:opacity-50"
                        ${is2faEnabled ? "" : "disabled"}>
                        Disable
                      </button>
                    </div>
                  </div>
                  <div id="twofa-setup" class="hidden mt-4 p-4 rounded-xl bg-slate-900/50 border border-slate-600/20">
                    <img id="twofa-qr-img" class="w-44 h-44 rounded-lg bg-white p-2 mx-auto" />
                    <input
                      id="twofa-code"
                      placeholder="123456"
                      inputmode="numeric"
                      autocomplete="one-time-code"
                      class="mt-4 w-full px-5 py-4 bg-slate-900/60 border border-slate-600/30 rounded-xl text-white"
                    />
                    <button
                      id="twofa-confirm"
                      class="mt-3 w-full px-6 py-3 rounded-xl bg-emerald-600/90 text-white font-semibold">
                      Confirm
                    </button>
                    <p id="twofa-msg" class="mt-2 text-sm text-slate-400"></p>
                  </div>
          </section>  

        <!-- ACTIONS -->
        <div class="flex justify-between items-center mt-10">
          <a
            href="#profile"
            class="text-slate-400 hover:text-purple-400 transition">
            ← Retour au profil
          </a>


        </div>

        <!-- TODO BACKEND -->
        <!--
          Bouton "Sauvegarder" :
          - regrouper toutes les modifications
          - envoyer au backend
          - afficher un feedback utilisateur (toast / message)
        -->

      </div>
    </div>
  `;
}

export function onMountSettings() {
  (async () => {
    const me = await fetchMe();
    if (!me) {
      window.location.hash = "#login";
      return;
    }
  paintAvatars(true);
  const passwordInput = document.getElementById("new-password-input") as HTMLInputElement | null;
  const toggleBtn = document.getElementById("toggle-password-btn");
  const eyeOpen = document.getElementById("eye-open");
  const eyeClosed = document.getElementById("eye-closed");

  toggleBtn?.addEventListener("click", () => {
    if (!passwordInput || !eyeOpen || !eyeClosed) return;
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    eyeOpen.classList.toggle("hidden", !isHidden);
    eyeClosed.classList.toggle("hidden", isHidden);
  });

  // 2FA
  const enableBtn = document.getElementById("twofa-enable-btn") as HTMLButtonElement | null;
  const disableBtn = document.getElementById("twofa-disable-btn") as HTMLButtonElement | null;

  const setupBox = document.getElementById("twofa-setup");
  const qrImg = document.getElementById("twofa-qr-img") as HTMLImageElement | null;
  const codeInput = document.getElementById("twofa-code") as HTMLInputElement | null;
  const confirmBtn = document.getElementById("twofa-confirm") as HTMLButtonElement | null;

  const msg = document.getElementById("twofa-msg");
  const statusEl = document.getElementById("twofa-status");

  const jsonHeaders = { "Content-Type": "application/json" };

  // Password change
  const oldPwdInput = document.getElementById("old-password-input") as HTMLInputElement | null;
  const newPwdInput = document.getElementById("new-password-input") as HTMLInputElement | null;
  const newPwd2Input = document.getElementById("new-password-confirm-input") as HTMLInputElement | null;
  const changePwdBtn = document.getElementById("change-password-btn") as HTMLButtonElement | null;
  const pwdMsg = document.getElementById("password-msg") as HTMLParagraphElement | null;

  const setPwdMsg = (t: string) => { if (pwdMsg) pwdMsg.textContent = t; };

  changePwdBtn?.addEventListener("click", async () => {
    try {
      const oldpwd = (oldPwdInput?.value ?? "").trim();
      const newpwd = (newPwdInput?.value ?? "").trim();
      const secnewpwd = (newPwd2Input?.value ?? "").trim();

      if (!oldpwd || !newpwd || !secnewpwd) {
        setPwdMsg("Fill all password fields.");
        return;
      }
      if (newpwd !== secnewpwd) {
        setPwdMsg("New passwords do not match.");
        return;
      }
      if (newpwd.length < 8) {
        setPwdMsg("Password must be at least 8 characters.");
        return;
      }

      setPwdMsg("Updating...");

      const res = await fetch(`${API_BASE}/users/me/updatePassword`, {
        method: "PATCH",
        headers: jsonHeaders,
        credentials: "include",
        body: JSON.stringify({ oldpwd, newpwd, secnewpwd }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? data?.message ?? "Password update failed");

      setPwdMsg("Password updated ✅");

      if (oldPwdInput) oldPwdInput.value = "";
      if (newPwdInput) newPwdInput.value = "";
      if (newPwd2Input) newPwd2Input.value = "";
    } catch (e: any) {
      setPwdMsg(e?.message ?? "Error");
    }
  });


    // Username change
  const usernameInput = document.getElementById("username-input") as HTMLInputElement | null;
  const changeUsernameBtn = document.getElementById("change-username-btn") as HTMLButtonElement | null;
  const usernameMsg = document.getElementById("username-msg") as HTMLParagraphElement | null;

  const setUsernameMsg = (t: string) => { if (usernameMsg) usernameMsg.textContent = t; };

  changeUsernameBtn?.addEventListener("click", async () => {
    try {
      const current = (getUser()?.username ?? "").trim();
      const username = (usernameInput?.value ?? "").trim();

      if (!username) { setUsernameMsg("Username cannot be empty."); return; }
      if (username.length < 3) { setUsernameMsg("Minimum 3 characters."); return; }
      if (username === current) { setUsernameMsg("No changes."); return; }

      setUsernameMsg("Updating...");

      const res = await fetch(`${API_BASE}/users/me/updateUsername`, {
        method: "PATCH",
        credentials: "include",
        headers: jsonHeaders,
        body: JSON.stringify({ username }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? data?.message ?? "Username update failed");

      const updatedUsername = data?.username ?? username;

      const u = getUser();
      if (u) {
        u.username = updatedUsername;
        localStorage.setItem("user", JSON.stringify(u));
      }


      setUsernameMsg("Username updated ✅");
    } catch (e: any) {
      setUsernameMsg(e?.message ?? "Error");
    }
  });

  const setMsg = (t: string) => { if (msg) msg.textContent = t; };

  const refresh2FAStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/2fa/status`, {
        method: "GET",
        credentials: "include",
        // headers: jsonHeaders,
      });

      const data = await res.json().catch(() => ({}));
      const enabled = !!data.enabled;

      if (statusEl) {
        statusEl.textContent = enabled ? "Enabled" : "Disabled";
        statusEl.className = enabled ? "text-emerald-400" : "text-red-400";
      }
      if (enableBtn) enableBtn.disabled = enabled;
      if (disableBtn) disableBtn.disabled = !enabled;

      if (enabled) setupBox?.classList.add("hidden");

      return enabled;
    } catch {
      return null;
    }
  };

  refresh2FAStatus();

  let setupStarted = false;
  if (confirmBtn)
    confirmBtn.disabled = true;

  enableBtn?.addEventListener("click", async () => {
    try {
      setMsg("Generating QR...");
      setupBox?.classList.remove("hidden");

      const res = await fetch(`${API_BASE}/auth/2fa/enable`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? data?.message ?? "Enable failed");

      const otpAuthUrl = data.optauthURL;
      if (!otpAuthUrl) throw new Error("No optauthURL returned");

      const finalUrl =
        `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(otpAuthUrl)}`;

      if (!qrImg) throw new Error("QR image element not found");
      qrImg.src = finalUrl;

      setupStarted = true;
      if (confirmBtn) confirmBtn.disabled = false;

      setMsg("Scan the QR and enter the 6-digit code.");
      codeInput?.focus();
    } catch (e: any) {
      setupStarted = false;
      if (confirmBtn) confirmBtn.disabled = true;
      setMsg(e?.message ?? "Error");
    }
  });

  confirmBtn?.addEventListener("click", async () => {
    try {
      if (!setupStarted) throw new Error("Click Enable first (2FA not initialized yet).");

      const code = (codeInput?.value ?? "").replace(/\s+/g, "").trim();
      if (code.length !== 6) throw new Error("Enter a valid 6-digit code");

      const res = await fetch(`${API_BASE}/auth/2fa/verify-setup`, {
        method: "POST",
        credentials: "include",
        headers: jsonHeaders,
        body: JSON.stringify({ code }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? data?.message ?? "Verify failed");

      setMsg("2FA enabled ✅");

      await refresh2FAStatus();

      setupStarted = false;
      if (confirmBtn) confirmBtn.disabled = true;
    } catch (e: any) {
      setMsg(e?.message ?? "Error");
    }
  });

  disableBtn?.addEventListener("click", async () => {
    try {
      const code = (prompt("Enter 6-digit code to disable 2FA:") ?? "").replace(/\s+/g, "").trim();
      if (code.length !== 6) return;

      const res = await fetch(`${API_BASE}/auth/2fa/disable`, {
        method: "POST",
        credentials: "include",
        headers: jsonHeaders,
        body: JSON.stringify({ code }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? data?.message ?? "Disable failed");

      setMsg("");

      await refresh2FAStatus();

      setupStarted = false;
      if (confirmBtn) confirmBtn.disabled = true;
      if (codeInput) codeInput.value = "";
    } catch (e: any) {
      alert(e?.message ?? "Error");
    }
  });


  const uploadBtn = document.getElementById("upload-avatar-btn") as HTMLButtonElement | null;
  const fileInput = document.getElementById("avatar-file-input") as HTMLInputElement | null;

  uploadBtn?.addEventListener("click", () => fileInput?.click());

  fileInput?.addEventListener("change", async () => {
    try {
      const file = fileInput?.files?.[0];
      if (!file) return;

      if (!["image/png", "image/jpeg"].includes(file.type)) {
        throw new Error("Only PNG/JPG allowed");
      }

      const form = new FormData();
      form.append("avatar", file); 

      const res = await fetch(`${API_BASE}/users/me/avatar`, {
        method: "PATCH",
        credentials: "include",
        body: form,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? data?.message ?? "Avatar upload failed");

      const avatarPath = data.avatarUrl; 
      if (!avatarPath) throw new Error("Backend did not return avatarUrl");
    

      setAvatarUrl(avatarPath);
      paintAvatars(true);
      if (fileInput) fileInput.value = "";
    } catch (e: any) {
      alert(e?.message ?? "Upload error");
    }

    });
  })();
}