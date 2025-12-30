import { getUser, resolveAvatarUrl } from "../state/auth";

// export function paintAvatars(cacheBust = false) {
//   const user = getUser();
//   if (!user?.avatarUrl) return; // should not happen if DB default works

//   const url = resolveAvatarUrl(user.avatarUrl);
//   const finalUrl = cacheBust ? `${url}?t=${Date.now()}` : url;

//   document.querySelectorAll<HTMLImageElement>("[data-avatar]").forEach((img) => {
//     img.src = finalUrl;
//   });
// }

// import { getUser, resolveAvatarUrl } from "../state/auth";

const FALLBACK = "/uploads/avatars/user-22.png";

export function paintAvatars(cacheBust = false) {
  const user = getUser();
  const url = user?.avatarUrl ? resolveAvatarUrl(user.avatarUrl) : FALLBACK;
  const finalUrl = cacheBust ? `${url}?t=${Date.now()}` : url;

  document.querySelectorAll<HTMLImageElement>("[data-avatar]").forEach(img => {
    img.src = finalUrl;
  });
}
