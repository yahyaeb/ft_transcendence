export type UserProfile = {
  username: string;
  avatar: string;
  language: "fr" | "en";
  age?: number;
  gender?: string;
};

const PROFILE_KEY = "user_profile";

/* -------- getters -------- */

export function getProfile(): UserProfile | null {
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function getAvatar(): string {
  const profile = getProfile();
  return profile?.avatar || "/avatars/default-avatar.png";
}

export function isProfileSet(): boolean {
  return !!getProfile();
}

/* -------- setters -------- */

export function setProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function updateProfile(partial: Partial<UserProfile>): void {
  const current = getProfile();
  if (!current) return;
  setProfile({ ...current, ...partial });
}

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_KEY);
}