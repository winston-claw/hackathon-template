"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useConvex, useMutation } from "convex/react";
import type { FunctionReference } from "convex/server";
import type { TokenStore, AuthProviderOptions, User } from "./types";
import { getUserFacingErrorMessage } from "../errors/get-user-facing-message";

function rethrowAsUserFacing(error: unknown, fallback: string): never {
  throw new Error(getUserFacingErrorMessage(error, fallback));
}

/** API shape expected by auth: Convex auth functions */
export interface AuthApi {
  auth: {
    login: FunctionReference<"mutation">;
    signup: FunctionReference<"mutation">;
    logout: FunctionReference<"mutation">;
    loginWithGoogle: FunctionReference<"mutation">;
    loginWithApple: FunctionReference<"mutation">;
    me: FunctionReference<"query">;
  };
}

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle?: (idToken: string) => Promise<void>;
  loginWithApple?: (args: { identityToken: string; email?: string; name?: string }) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within the AuthProvider");
  }
  return context;
}

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
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const convex = useConvex();
    const loginMutation = useMutation(api.auth.login);
    const signupMutation = useMutation(api.auth.signup);
    const logoutMutation = useMutation(api.auth.logout);
    const loginWithGoogleMutation = useMutation(api.auth.loginWithGoogle);
    const loginWithAppleMutation = useMutation(api.auth.loginWithApple);

    useEffect(() => {
      let cancelled = false;

      async function restoreSession() {
        const storedToken = await normalizeToken(tokenStore.getToken());
        if (cancelled) return;

        if (!storedToken) {
          setLoading(false);
          return;
        }

        try {
          const me = await convex.query(api.auth.me, { token: storedToken });
          if (cancelled) return;

          if (me) {
            setToken(storedToken);
            setUser(me);
          } else {
            await normalizeVoid(() => tokenStore.removeToken());
            setToken(null);
            setUser(null);
          }
        } catch {
          if (!cancelled) {
            await normalizeVoid(() => tokenStore.removeToken());
            setToken(null);
            setUser(null);
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      }

      void restoreSession();
      return () => {
        cancelled = true;
      };
    }, [convex]);

    const login = useCallback(
      async (email: string, password: string) => {
        try {
          const result = await loginMutation({ email, password });
          await normalizeVoid(() => tokenStore.setToken(result.token));
          setToken(result.token);
          setUser({ userId: result.userId, name: result.name, email });
          onLogin?.();
        } catch (error) {
          rethrowAsUserFacing(
            error,
            "Login failed. Check your email and password."
          );
        }
      },
      [loginMutation, tokenStore, onLogin]
    );

    const signup = useCallback(
      async (name: string, email: string, password: string) => {
        try {
          const result = await signupMutation({ name, email, password });
          await normalizeVoid(() => tokenStore.setToken(result.token));
          setToken(result.token);
          setUser({ userId: result.userId, name: result.name, email });
          onLogin?.();
        } catch (error) {
          rethrowAsUserFacing(error, "Signup failed. Please try again.");
        }
      },
      [signupMutation, tokenStore, onLogin]
    );

    const logout = useCallback(async () => {
      const token = await normalizeToken(tokenStore.getToken());
      if (token) {
        await logoutMutation({ token });
      }
      await normalizeVoid(() => tokenStore.removeToken());
      setToken(null);
      setUser(null);
      onLogout?.();
    }, [logoutMutation, tokenStore, onLogout]);

    const loginWithGoogle = useCallback(
      async (idToken: string) => {
        try {
          const result = await loginWithGoogleMutation({ idToken });
          await normalizeVoid(() => tokenStore.setToken(result.token));
          setToken(result.token);
          setUser({ userId: result.userId, name: result.name, email: "" });
          onLogin?.();
        } catch (error) {
          rethrowAsUserFacing(error, "Google sign-in failed.");
        }
      },
      [loginWithGoogleMutation, tokenStore, onLogin]
    );

    const loginWithApple = useCallback(
      async (args: { identityToken: string; email?: string; name?: string }) => {
        try {
          const result = await loginWithAppleMutation(args);
          await normalizeVoid(() => tokenStore.setToken(result.token));
          setToken(result.token);
          setUser({ userId: result.userId, name: result.name, email: "" });
          onLogin?.();
        } catch (error) {
          rethrowAsUserFacing(error, "Apple sign-in failed.");
        }
      },
      [loginWithAppleMutation, tokenStore, onLogin]
    );

    const value: AuthContextValue = {
      user,
      token,
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

  return { AuthProvider: AuthProviderInner, useAuth };
}
