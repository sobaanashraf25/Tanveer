import type { Property, PropertyCategory } from '@/lib/properties';

const FUNCTION_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SESSION_KEY = 'tanveer-admin-session';

export interface AdminSession {
  token: string;
  expiresAt: string;
}

export interface PropertyInput {
  title: string;
  category: PropertyCategory;
  location: string;
  area_sqft: number;
  price_lakh: number;
  description: string;
  is_featured: boolean;
  image_paths: string[];
}

export function loadSession(): AdminSession | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as Partial<AdminSession>;
    if (typeof session.token !== 'string' || typeof session.expiresAt !== 'string') return null;
    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return { token: session.token, expiresAt: session.expiresAt };
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveSession(session: AdminSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

async function callAdminApi<T>(path: string, body?: unknown, token?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${FUNCTION_BASE}${path}`, {
      method: 'POST',
      headers: {
        apikey: ANON_KEY,
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }

  const payload = (await response.json().catch(() => null)) as { error?: string } | null;
  if (!response.ok) {
    throw new Error(payload?.error ?? 'Something went wrong. Please try again.');
  }
  return payload as T;
}

function isSessionPayload(value: unknown): value is AdminSession {
  const v = value as Partial<AdminSession> | null;
  return typeof v?.token === 'string' && typeof v?.expiresAt === 'string';
}

export async function adminLogin(phone: string, password: string): Promise<AdminSession> {
  const payload = await callAdminApi<unknown>('/login', { phone, password });
  if (!isSessionPayload(payload)) throw new Error('Unexpected response from the server.');
  return payload;
}

export async function adminLogout(token: string): Promise<void> {
  await callAdminApi<unknown>('/logout', {}, token);
}

export async function uploadPhoto(token: string, file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const payload = await callAdminApi<{ path?: unknown }>('/upload', form, token);
  if (typeof payload.path !== 'string') throw new Error('Unexpected response from the server.');
  return payload.path;
}

export async function saveProperty(token: string, input: PropertyInput, id?: string): Promise<Property> {
  const payload = await callAdminApi<{ property?: Property }>(
    '/properties/save',
    { id, property: input },
    token,
  );
  if (!payload.property) throw new Error('Unexpected response from the server.');
  return payload.property;
}

export async function deleteProperty(token: string, id: string): Promise<void> {
  await callAdminApi<unknown>('/properties/delete', { id }, token);
}
