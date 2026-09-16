/**
 * Client-side authentication helpers.
 * Manages JWT token and user object in localStorage.
 */

export interface AuthUser {
  id: number;
  email: string;
  role: 'student' | 'educator';
}

const TOKEN_KEY = 'adaptivelearn_token';
const USER_KEY = 'adaptivelearn_user';

export function saveAuth(token: string, user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
