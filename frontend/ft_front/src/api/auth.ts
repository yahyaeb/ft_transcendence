// src/api/auth.ts
import { API_BASE_URL } from "../config";

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export async function signup(payload: SignupPayload): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Signup failed";
    try {
      const body = await res.json();
      if (body && typeof body.message === "string") {
        message = body.message;
      }
    } catch (_) {
      // ignore JSON parse error
    }
    throw new Error(message);
  }

  return res.json();
}
