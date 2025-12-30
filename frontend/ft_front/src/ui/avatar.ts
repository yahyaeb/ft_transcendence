import { getUser, resolveAvatarUrl } from "../state/auth";

const FALLBACK = "/uploads/avatars/user-22.png";

export function paintAvatars(cacheBust = false) {
  const user = getUser();

  const resolved =
    resolveAvatarUrl(user?.avatarUrl ?? null) ?? resolveAvatarUrl(FALLBACK)!;

  const finalUrl = cacheBust ? `${resolved}?t=${Date.now()}` : resolved;

  document.querySelectorAll<HTMLImageElement>("[data-avatar]").forEach(img => {
    img.src = finalUrl;
  });
}
