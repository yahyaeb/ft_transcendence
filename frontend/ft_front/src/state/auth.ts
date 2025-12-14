

type User = {
  username: string;
  email: string;
};

let currentUser: User | null = null;

export function login(username: string, email: string) {
  currentUser = { username, email };
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