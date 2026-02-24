"use client";

import * as SecureStore from "expo-secure-store";
import {
  createAuthProvider,
  createSecureStoreTokenStore,
  type AuthApi,
} from "@project-template/auth";
import { api } from "@project-template/db/api";

const tokenStore = createSecureStoreTokenStore(SecureStore);
const { AuthProvider: BaseAuthProvider, useAuth: useAuthBase } =
  createAuthProvider(api as AuthApi, tokenStore);

export { useAuthBase as useAuth };

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
