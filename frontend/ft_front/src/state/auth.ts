type User = {
  username: string;
  email?: string;
  avatarUrl?: string;
};

let currentUser: User | null = null;

/**
 * Mock login (front-only).
 * Accepts either (username, email) legacy signature OR an object like { username, password }.
 */
export function login(
  arg1: string | { username: string; password?: string; email?: string },
  arg2?: string
) {
  // Legacy: login(username, email)
  if (typeof arg1 === "string") {
    const username = arg1;
    const email = arg2;
    currentUser = { username, email, avatarUrl: "/avatars/default-avatar.png" };
    return;
  }

  // Object form: login({ username, password, email })
  const { username, email } = arg1;
  currentUser = { username, email, avatarUrl: "/avatars/default-avatar.png" };
}

export function logout() {
  currentUser = null;
}

export function isAuthenticated(): boolean {
  return currentUser !== null;
}

export function getUser(): User | null {
  return currentUser;
}

export function getAvatar(): string {
  return currentUser?.avatarUrl ?? "/avatars/default-avatar.png";
}