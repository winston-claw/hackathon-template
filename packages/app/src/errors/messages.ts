import { AppErrorCode, type AppErrorCodeType } from "../../../../convex/errors";

/** User-facing copy for each backend error code. Edit here — not in Convex handlers. */
export const APP_ERROR_MESSAGES: Record<AppErrorCodeType, string> = {
  [AppErrorCode.INVALID_CREDENTIALS]: "Invalid email or password.",
  [AppErrorCode.USER_ALREADY_EXISTS]: "An account with this email already exists.",
  [AppErrorCode.OAUTH_ACCOUNT_REQUIRED]:
    "This account uses a sign-in provider. Sign in with Google or Apple.",
  [AppErrorCode.INVALID_GOOGLE_TOKEN]: "Google sign-in failed. Please try again.",
  [AppErrorCode.GOOGLE_EMAIL_CONFLICT]:
    "An account with this email already exists. Sign in with email and password, or use the provider you signed up with.",
  [AppErrorCode.APPLE_EMAIL_CONFLICT]:
    "An account with this email already exists.",
  [AppErrorCode.APPLE_SIGN_IN_FAILED]: "Apple sign-in failed. Please try again.",
  [AppErrorCode.UNAUTHORIZED]: "You need to sign in to continue.",
  [AppErrorCode.TASK_TITLE_REQUIRED]: "Enter a task title.",
  [AppErrorCode.TASK_NOT_FOUND]: "That task could not be found.",
};
