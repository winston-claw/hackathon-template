import type { TokenStore } from "../types";

const KEY = "auth_token";

type SimpleStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

function getStorage(): SimpleStorage | null {
  if (typeof globalThis === "undefined") return null;
  const g = globalThis as { localStorage?: SimpleStorage };
  return g.localStorage ?? null;
}

/**
 * Token store using localStorage. Use in web (Next.js) app.
 */
export function createLocalStorageTokenStore(): TokenStore {
  return {
    getToken(): string | null {
      const storage = getStorage();
      return storage ? storage.getItem(KEY) : null;
    },
    setToken(token: string): void {
      const storage = getStorage();
      if (storage) storage.setItem(KEY, token);
    },
    removeToken(): void {
      const storage = getStorage();
      if (storage) storage.removeItem(KEY);
    },
  };
}
