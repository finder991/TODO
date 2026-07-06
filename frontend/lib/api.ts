import { AuthResponse, Task, TaskStatus, User } from './types';

const API_URL = '/api';

export function setAuth(user: User): void {
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem('user');
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  return raw ? (JSON.parse(raw) as User) : null;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
}

async function request<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.message || `Request failed with status ${res.status}`, res.status);
  }

  return data as T;
}

export interface TaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export const api = {
  register: (payload: { email: string; name: string; password: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: payload }),
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: payload }),
  getTasks: (status?: TaskStatus | '') =>
    request<{ tasks: Task[] }>(`/tasks${status ? `?status=${status}` : ''}`),
  createTask: (payload: TaskPayload) =>
    request<{ task: Task }>('/tasks', { method: 'POST', body: payload }),
  updateTask: (id: number, payload: Partial<TaskPayload>) =>
    request<{ task: Task }>(`/tasks/${id}`, { method: 'PUT', body: payload }),
  deleteTask: (id: number) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
};
