"use client";

import * as SecureStore from "expo-secure-store";
import {
  createAuthProvider,
  createSecureStoreTokenStore,
  type AuthApi,
  useAuth,
} from "@project-template/app";
export { useAuth };
import { api } from "@project-template/app/db/api";

const tokenStore = createSecureStoreTokenStore(SecureStore);
const { AuthProvider: BaseAuthProvider } = createAuthProvider(
  api as AuthApi,
  tokenStore
);

export function AuthProvider({
  children,
  onLogin,
  onLogout,
}: {
  children: React.ReactNode;
  onLogin?: () => void;
  onLogout?: () => void;
}) {
  return (
    <BaseAuthProvider onLogin={onLogin} onLogout={onLogout}>
      {children}
    </BaseAuthProvider>
  );
}
