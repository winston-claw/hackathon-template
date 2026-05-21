export interface User {
  userId: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Sign in with Google (web/mobile). Pass the id_token from Google OAuth. */
  loginWithGoogle?: (idToken: string) => Promise<void>;
  /** Sign in with Apple. Pass identityToken from Apple response; email/name optional. */
  loginWithApple?: (args: { identityToken: string; email?: string; name?: string }) => Promise<void>;
}

/**
 * Platform-specific token storage.
 * Web: localStorage; Mobile: expo-secure-store.
 */
export interface TokenStore {
  getToken(): Promise<string | null> | string | null;
  setToken(token: string): Promise<void> | void;
  removeToken(): Promise<void> | void;
}

export interface AuthProviderOptions {
  /** Called after successful login/signup (e.g. router.push('/dashboard')) */
  onLogin?: () => void;
  /** Called after logout (e.g. router.push('/')) */
  onLogout?: () => void;
}
