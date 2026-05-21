import { ConvexError } from "convex/values";

/** Stable codes for expected failures — UI maps these to copy in packages/app. */
export const AppErrorCode = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  OAUTH_ACCOUNT_REQUIRED: "OAUTH_ACCOUNT_REQUIRED",
  INVALID_GOOGLE_TOKEN: "INVALID_GOOGLE_TOKEN",
  GOOGLE_EMAIL_CONFLICT: "GOOGLE_EMAIL_CONFLICT",
  APPLE_EMAIL_CONFLICT: "APPLE_EMAIL_CONFLICT",
  APPLE_SIGN_IN_FAILED: "APPLE_SIGN_IN_FAILED",
  UNAUTHORIZED: "UNAUTHORIZED",
  TASK_TITLE_REQUIRED: "TASK_TITLE_REQUIRED",
  TASK_NOT_FOUND: "TASK_NOT_FOUND",
} as const;

export type AppErrorCodeType = (typeof AppErrorCode)[keyof typeof AppErrorCode];

export type AppErrorPayload = { code: AppErrorCodeType };

/** Throw a structured app error the client maps to human-readable copy. */
export function appError(code: AppErrorCodeType): never {
  throw new ConvexError({ code } satisfies AppErrorPayload);
}
