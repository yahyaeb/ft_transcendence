export function renderHome() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <header class="w-full flex justify-end items-center p-6 gap-4">
      <select id="lang-select"
        class="px-4 py-2 text-sm text-white bg-white/10 rounded-lg backdrop-blur-md border border-white/10 hover:bg-white/20 transition cursor-pointer">
        <option value="fr">🇫🇷 Français</option>
        <option value="en">🇬🇧 English</option>
        <option value="es">🇪🇸 Español</option>
        <option value="de">🇩🇪 Deutsch</option>
      </select>
      <a href="#profile"
        class="px-4 py-2 text-sm text-white bg-white/10 rounded-lg backdrop-blur-md border border-white/10 hover:bg-white/20 transition">👤 Profile</a>
    </header>

    <main class="flex flex-col items-center text-center px-6 mt-20">
      <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">Transcendence</h1>
      <p class="text-gray-300 max-w-xl text-lg mb-12 text-left text-justify">
        Un projet Full-Stack moderne où vous jouez au Pong revisité, affrontez vos amis,
        grimpez dans le classement et explorez une expérience immersive.
      </p>
      <div class="flex flex-col md:flex-row gap-6 mt-4">
        <a href="#login" class="px-12 py-6 text-xl text-white rounded-2xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition shadow-xl">🏓 Play</a>
        <button class="px-12 py-6 text-xl text-white rounded-2xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition shadow-xl">✨ Feature</button>
        <button class="px-12 py-6 text-xl text-white rounded-2xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition shadow-xl">⚙️ Settings</button>
      </div>
    </main>
  `;
}
