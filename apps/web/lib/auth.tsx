"use client";

import {
  createAuthProvider,
  createLocalStorageTokenStore,
  type AuthApi,
  useAuth,
} from "@app-template/app";
export { useAuth };
import { api } from "@app-template/app/db/api";

const tokenStore = createLocalStorageTokenStore();
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
