export type User = {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;             
  two_factor_enabled?: string; 
};

const API_BASE = `https://localhost:4999`;

const TOKEN_KEY = "access_token";

let currentUser: User | null = null;
let token: string | null = null;

export function getToken(): string | null {
  return token ?? localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getUser(): User | null {
  if (currentUser) return currentUser;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    currentUser = JSON.parse(raw);
    return currentUser;
  } catch {
    return null;
  }
}


export async function logout() {

    currentUser = null;
    token = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("user");
    localStorage.setItem('logout-event', Date.now().toString())
}

export async function login(payload: {
  email: string;
  password: string;
  code?: string; 
}): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error ?? data?.message ?? "Login failed");
  }

  if (!data?.token || !data?.user) {
    throw new Error("Login succeeded but response is missing token/user");
  }

  token = data.token;
  localStorage.setItem(TOKEN_KEY, data.token);

  currentUser = {
    id: data.user.id,
    username: data.user.username,
    email: data.user.email,
    avatarUrl: data.user.avatarUrl ?? data.user.avatar ?? undefined,
    two_factor_enabled: data.user.two_factor_enabled,
  };
  localStorage.setItem("user", JSON.stringify(currentUser));
  return currentUser;
}


export function resolveAvatarUrl(avatarUrl?: string | null) {
  if (!avatarUrl || avatarUrl.trim().length === 0) return null;
  return avatarUrl.startsWith("http")
    ? avatarUrl
    : `${API_BASE}${avatarUrl}`;
}


export function setAvatarUrl(avatarUrl: string) {
  if (!currentUser) return;
  currentUser.avatarUrl = avatarUrl;
  localStorage.setItem("user", JSON.stringify(currentUser));
}
