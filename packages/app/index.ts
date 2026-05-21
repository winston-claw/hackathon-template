export { LoginScreen } from "./src/screens/login-screen";
export { SignupScreen } from "./src/screens/signup-screen";
export { DashboardScreen } from "./src/screens/dashboard-screen";
export { TasksScreen } from "./src/screens/tasks-screen";
export { OnboardingHomeScreen } from "./src/screens/onboarding-home-screen";
export { MarketingHomeScreen } from "./src/screens/marketing-home-screen";

export { AppErrorBoundary } from "./src/components/app-error-boundary";
export { AuthGuard } from "./src/components/auth-guard";

export {
  createAuthProvider,
  useAuth,
  createLocalStorageTokenStore,
  createSecureStoreTokenStore,
} from "./src/auth";
export type {
  User,
  TokenStore,
  AuthApi,
  AuthProviderProps,
  AuthProviderOptions,
  OAuthHandlers,
} from "./src/auth";
export { OAuthProvider, useOAuth, useOAuthActions } from "./src/auth";
export {
  getUserFacingErrorMessage,
  EXPECTED_AUTH_CONVEX_LOG,
} from "./src/errors/get-user-facing-message";
/** @deprecated Use getUserFacingErrorMessage */
export { getUserFacingErrorMessage as getAuthErrorMessage } from "./src/errors/get-user-facing-message";
export { APP_ERROR_MESSAGES } from "./src/errors/messages";
export { AppErrorCode, type AppErrorCodeType } from "../../convex/errors";

export { createConvexClient } from "./src/db";
export { api, internal } from "./src/db/api";
