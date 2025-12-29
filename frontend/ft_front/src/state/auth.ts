export type User = {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;             
  two_factor_enabled?: string; 
};

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
  return currentUser;
}

// export function getAvatar(): string {
//   return currentUser?.avatarUrl ?? "null";
// }

export function logout() {
  currentUser = null;
  token = null;
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(payload: {
  email: string;
  password: string;
  code?: string; 
}): Promise<User> {
  const res = await fetch("http://localhost:4999/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    avatarUrl: data.user.avatar ?? "null",
    two_factor_enabled: data.user.two_factor_enabled,
  };

  return currentUser;
}

