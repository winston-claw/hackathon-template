"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useMutation } from "convex/react";
import type { FunctionReference } from "convex/server";
import type { TokenStore, AuthProviderOptions, User } from "./types";

/** API shape expected by auth: Convex mutation refs for login, signup, logout, OAuth */
export interface AuthApi {
  auth: {
    login: FunctionReference<"mutation">;
    signup: FunctionReference<"mutation">;
    logout: FunctionReference<"mutation">;
    loginWithGoogle: FunctionReference<"mutation">;
    loginWithApple: FunctionReference<"mutation">;
  };
}

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle?: (idToken: string) => Promise<void>;
  loginWithApple?: (args: { identityToken: string; email?: string; name?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeToken(
  value: string | null | Promise<string | null>
): Promise<string | null> {
  if (value === null || typeof value === "string")
    return Promise.resolve(value);
  return value;
}

function normalizeVoid(fn: () => void | Promise<void>): Promise<void> {
  const result = fn();
  return result instanceof Promise ? result : Promise.resolve();
}

export interface AuthProviderProps {
  children: ReactNode;
  /** Override default onLogin (e.g. router.push('/dashboard')) */
  onLogin?: () => void;
  /** Override default onLogout (e.g. router.push('/')) */
  onLogout?: () => void;
}

export function createAuthProvider(
  api: AuthApi,
  tokenStore: TokenStore,
  defaultOptions: AuthProviderOptions = {}
) {
  const { onLogin: defaultOnLogin, onLogout: defaultOnLogout } =
    defaultOptions;

  function AuthProviderInner({
    children,
    onLogin = defaultOnLogin,
    onLogout = defaultOnLogout,
  }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loginMutation = useMutation(api.auth.login);
    const signupMutation = useMutation(api.auth.signup);
    const logoutMutation = useMutation(api.auth.logout);
    const loginWithGoogleMutation = useMutation(api.auth.loginWithGoogle);
    const loginWithAppleMutation = useMutation(api.auth.loginWithApple);

    useEffect(() => {
      let cancelled = false;
      (async () => {
        const token = await normalizeToken(tokenStore.getToken());
        if (cancelled) return;
        setLoading(false);
      })();
      return () => {
        cancelled = true;
      };
    }, []);

    const login = useCallback(
      async (email: string, password: string) => {
        const result = await loginMutation({ email, password });
        await normalizeVoid(() => tokenStore.setToken(result.token));
        setUser({ userId: result.userId, name: result.name, email });
        onLogin?.();
      },
      [loginMutation, tokenStore, onLogin]
    );

    const signup = useCallback(
      async (name: string, email: string, password: string) => {
        const result = await signupMutation({ name, email, password });
        await normalizeVoid(() => tokenStore.setToken(result.token));
        setUser({ userId: result.userId, name: result.name, email });
        onLogin?.();
      },
      [signupMutation, tokenStore, onLogin]
    );

    const logout = useCallback(async () => {
      const token = await normalizeToken(tokenStore.getToken());
      if (token) {
        await logoutMutation({ token });
      }
      await normalizeVoid(() => tokenStore.removeToken());
      setUser(null);
      onLogout?.();
    }, [logoutMutation, tokenStore, onLogout]);

    const loginWithGoogle = useCallback(
      async (idToken: string) => {
        const result = await loginWithGoogleMutation({ idToken });
        await normalizeVoid(() => tokenStore.setToken(result.token));
        setUser({ userId: result.userId, name: result.name, email: "" });
        onLogin?.();
      },
      [loginWithGoogleMutation, tokenStore, onLogin]
    );

    const loginWithApple = useCallback(
      async (args: { identityToken: string; email?: string; name?: string }) => {
        const result = await loginWithAppleMutation(args);
        await normalizeVoid(() => tokenStore.setToken(result.token));
        setUser({ userId: result.userId, name: result.name, email: "" });
        onLogin?.();
      },
      [loginWithAppleMutation, tokenStore, onLogin]
    );

    const value: AuthContextValue = {
      user,
      loading,
      login,
      signup,
      logout,
      loginWithGoogle,
      loginWithApple,
    };

    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  }

  function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error("useAuth must be used within the AuthProvider");
    }
    return context;
  }

  return { AuthProvider: AuthProviderInner, useAuth };
}
