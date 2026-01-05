export type User = {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  two_factor_enabled?: string;
};

const API_BASE = `https://localhost:4999`;

let currentUser: User | null = null;

export function isAuthenticated(): boolean {
  return !!getUser();
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

export async function fetchMe(): Promise<User | null> {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    currentUser = null;
    localStorage.removeItem("user");
    return null;
  }

  const data = await res.json().catch(() => ({}));
  const user: User = {
    id: data.id ?? data.user?.id,
    username: data.username ?? data.user?.username,
    email: data.email ?? data.user?.email,
    avatarUrl: data.avatarUrl ?? data.user?.avatarUrl ?? data.avatar ?? data.user?.avatar,
    two_factor_enabled: data.two_factor_enabled ?? data.user?.two_factor_enabled,
  };

  currentUser = user;
  localStorage.setItem("user", JSON.stringify(user));
  return user;
}

export async function login(payload: {
  email: string;
  password: string;
  code?: string;
}): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error ?? data?.message ?? "Login failed");
  }
  if (!data?.user) {
    throw new Error("Login succeeded but response is missing user");
  }
  currentUser = {
    id: data.user.id,
    username: data.user.username,
    email: data.user.email,
    avatarUrl: data.user.avatarUrl ?? data.user.avatar ?? undefined,
    two_factor_enabled: data.user.two_factor_enabled,
  };

  localStorage.setItem("user", JSON.stringify(currentUser));
  localStorage.setItem("login-event", Date.now().toString());
  return currentUser;
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => {});

  localStorage.removeItem("user");
  localStorage.setItem("logout-event", Date.now().toString());

  // THIS TAB
  window.location.hash = "#login";
  window.location.reload();
}


export function resolveAvatarUrl(avatarUrl?: string | null) {
  if (!avatarUrl || avatarUrl.trim().length === 0) return null;
  return avatarUrl.startsWith("http") ? avatarUrl : `${API_BASE}${avatarUrl}`;
}

export function setAvatarUrl(avatarUrl: string) {
  if (!currentUser) return;
  currentUser.avatarUrl = avatarUrl;
  localStorage.setItem("user", JSON.stringify(currentUser));
}
