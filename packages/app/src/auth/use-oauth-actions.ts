"use client";

import { Platform } from "react-native";
import { useOAuth } from "./oauth-context";
import { getUserFacingErrorMessage } from "./errors";

type OAuthActionHandlers = {
  setError: (message: string) => void;
  setOauthNotice: (message: string) => void;
  setLoading: (loading: boolean) => void;
};

function missingConfigMessage(provider: "Google" | "Apple"): string {
  if (provider === "Google") {
    return "Google sign-in is not configured. Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to apps/mobile/.env (see .env.example).";
  }
  return "Sign in with Apple requires an iOS device and Apple Developer setup for your bundle ID.";
}

export function useOAuthActions({
  setError,
  setOauthNotice,
  setLoading,
}: OAuthActionHandlers) {
  const oauth = useOAuth();

  const runGoogle = async () => {
    setError("");
    setOauthNotice("");

    if (Platform.OS === "web" || !oauth) {
      setOauthNotice("Use the web OAuth routes when running in a browser.");
      return;
    }

    if (!oauth.isGoogleConfigured) {
      setOauthNotice(missingConfigMessage("Google"));
      return;
    }

    setLoading(true);
    try {
      await oauth.signInWithGoogle();
    } catch (err: unknown) {
      const message = getUserFacingErrorMessage(err, "Google sign-in failed");
      if (message.toLowerCase().includes("cancel")) {
        return;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const runApple = async () => {
    setError("");
    setOauthNotice("");

    if (Platform.OS === "web" || !oauth) {
      setOauthNotice("Use the web OAuth routes when running in a browser.");
      return;
    }

    if (!oauth.isAppleConfigured) {
      setOauthNotice(missingConfigMessage("Apple"));
      return;
    }

    setLoading(true);
    try {
      await oauth.signInWithApple();
    } catch (err: unknown) {
      const message = getUserFacingErrorMessage(err, "Apple sign-in failed");
      if (
        message.includes("ERR_REQUEST_CANCELED") ||
        message.toLowerCase().includes("cancel")
      ) {
        return;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { runGoogle, runApple };
}
