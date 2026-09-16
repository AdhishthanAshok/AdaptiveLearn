/**
 * API client for the AdaptiveLearn backend.
 * Provides typed functions for all API endpoints with auth-aware fetch.
 */
import { getToken, AuthUser, saveAuth } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  duration: number;
  difficulty: string;
  view_count: number;
  created_by: number | null;
}

export interface QuizOption {
  id: number;
  option_text: string;
  is_correct: boolean;
}

export interface Quiz {
  id: number;
  video_id: number;
  question: string;
  timestamp: number;
  explanation: string;
  options: QuizOption[];
}

export interface AnswerResponse {
  is_correct: boolean;
  explanation: string;
  correct_option_id: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface QuizAttemptDetail {
  id: number;
  quiz_id: number;
  question: string;
  video_title: string;
  selected_option_text: string;
  correct_option_text: string;
  is_correct: boolean;
  attempted_at: string;
}

export interface QuizHistoryStats {
  total_attempted: number;
  total_correct: number;
  accuracy_percent: number;
  attempts: QuizAttemptDetail[];
}

// ---------------------------------------------------------------------------
// Auth-aware fetch
// ---------------------------------------------------------------------------
async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
}

// ---------------------------------------------------------------------------
// Auth endpoints
// ---------------------------------------------------------------------------
export async function registerUser(
  email: string,
  password: string,
  role: string,
): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Registration failed');
  }
  const data: TokenResponse = await res.json();
  saveAuth(data.access_token, data.user);
  return data;
}

export async function loginUser(email: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Login failed');
  }
  const data: TokenResponse = await res.json();
  saveAuth(data.access_token, data.user);
  return data;
}

export async function fetchMe(): Promise<AuthUser> {
  const res = await authFetch(`${API_BASE_URL}/auth/me`);
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

// ---------------------------------------------------------------------------
// Feed & video endpoints
// ---------------------------------------------------------------------------
export async function fetchFeed(): Promise<Video[]> {
  const res = await fetch(`${API_BASE_URL}/feed`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch feed');
  const data = await res.json();
  return data.videos;
}

export async function incrementVideoView(videoId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/videos/${videoId}/view`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to increment view count');
}

// ---------------------------------------------------------------------------
// Quiz endpoints
// ---------------------------------------------------------------------------
export async function fetchQuiz(videoId: number): Promise<Quiz | null> {
  const res = await fetch(`${API_BASE_URL}/videos/${videoId}/quiz`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch quiz');
  return res.json();
}

export async function submitAnswer(quizId: number, optionId: number): Promise<AnswerResponse> {
  const res = await authFetch(`${API_BASE_URL}/quizzes/${quizId}/attempt`, {
    method: 'POST',
    body: JSON.stringify({ selected_option_id: optionId }),
  });
  if (!res.ok) throw new Error('Failed to submit answer');
  return res.json();
}

export async function fetchQuizHistory(): Promise<QuizHistoryStats> {
  const res = await authFetch(`${API_BASE_URL}/quizzes/history`);
  if (!res.ok) throw new Error('Failed to fetch quiz history');
  return res.json();
}

// ---------------------------------------------------------------------------
// Educator endpoints
// ---------------------------------------------------------------------------
export async function createVideo(video: {
  title: string;
  description: string;
  video_url: string;
  duration: number;
  difficulty: string;
}): Promise<Video> {
  const res = await authFetch(`${API_BASE_URL}/educator/videos`, {
    method: 'POST',
    body: JSON.stringify(video),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to create video');
  }
  return res.json();
}

export async function fetchMyVideos(): Promise<Video[]> {
  const res = await authFetch(`${API_BASE_URL}/educator/videos`);
  if (!res.ok) throw new Error('Failed to fetch videos');
  return res.json();
}

export async function createQuizForVideo(
  videoId: number,
  quiz: {
    question: string;
    timestamp: number;
    explanation: string;
    options: { option_text: string; is_correct: boolean }[];
  },
): Promise<Quiz> {
  const res = await authFetch(`${API_BASE_URL}/educator/videos/${videoId}/quiz`, {
    method: 'POST',
    body: JSON.stringify(quiz),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to create quiz');
  }
  return res.json();
}
