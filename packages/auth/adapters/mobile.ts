import type { TokenStore } from "../types";

const KEY = "auth_token";

/**
 * Token store using expo-secure-store. Use in Expo app.
 * Requires: import * as SecureStore from 'expo-secure-store'
 */
export function createSecureStoreTokenStore(
  SecureStore: {
    getItemAsync(key: string): Promise<string | null>;
    setItemAsync(key: string, value: string): Promise<void>;
    deleteItemAsync(key: string): Promise<void>;
  }
): TokenStore {
  return {
    getToken(): Promise<string | null> {
      return SecureStore.getItemAsync(KEY);
    },
    setToken(token: string): Promise<void> {
      return SecureStore.setItemAsync(KEY, token);
    },
    removeToken(): Promise<void> {
      return SecureStore.deleteItemAsync(KEY);
    },
  };
}
