export type AuthUser = {
  id: string;
  email: string;
};

export type AuthPayload = {
  token: string;
  user: AuthUser;
};

const AUTH_STORAGE_KEY = "expo.auth";

export function getStoredAuth(): AuthPayload | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthPayload;
    if (!parsed.token || !parsed.user) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function setStoredAuth(payload: AuthPayload) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
}

export function clearStoredAuth() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
