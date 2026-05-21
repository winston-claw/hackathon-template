"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { Platform } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import { OAuthProvider, type OAuthHandlers } from "@app-template/app";
import { useAuth } from "./auth";

WebBrowser.maybeCompleteAuthSession();

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "";
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

type PendingGoogleSignIn = {
  resolve: () => void;
  reject: (error: Error) => void;
};

function isGoogleOAuthConfigured(): boolean {
  if (!webClientId) return false;
  if (Platform.OS === "ios") return Boolean(iosClientId);
  if (Platform.OS === "android") return Boolean(androidClientId);
  return true;
}

async function signInWithApple(loginWithApple: NonNullable<
  ReturnType<typeof useAuth>["loginWithApple"]
>) {
  if (Platform.OS !== "ios") {
    throw new Error("Sign in with Apple is only available on iOS.");
  }

  const available = await AppleAuthentication.isAvailableAsync();
  if (!available) {
    throw new Error("Sign in with Apple is not available on this device.");
  }

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error("Apple sign-in did not return an identity token.");
  }

  const givenName = credential.fullName?.givenName ?? "";
  const familyName = credential.fullName?.familyName ?? "";
  const name = [givenName, familyName].filter(Boolean).join(" ") || undefined;

  await loginWithApple({
    identityToken: credential.identityToken,
    email: credential.email ?? undefined,
    name,
  });
}

function MobileOAuthProviderWithoutGoogle({
  children,
}: {
  children: ReactNode;
}) {
  const { loginWithApple } = useAuth();

  const handlers = useMemo<OAuthHandlers>(
    () => ({
      isGoogleConfigured: false,
      isAppleConfigured: Platform.OS === "ios",

      async signInWithGoogle() {
        const platformHint =
          Platform.OS === "ios"
            ? "Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID and EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID in apps/mobile/.env"
            : Platform.OS === "android"
              ? "Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID and EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID in apps/mobile/.env"
              : "Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in apps/mobile/.env";
        throw new Error(`Google OAuth is not configured. ${platformHint}`);
      },

      async signInWithApple() {
        if (!loginWithApple) {
          throw new Error("Apple sign-in is not available.");
        }
        await signInWithApple(loginWithApple);
      },
    }),
    [loginWithApple]
  );

  return <OAuthProvider handlers={handlers}>{children}</OAuthProvider>;
}

function MobileOAuthProviderWithGoogle({
  children,
}: {
  children: ReactNode;
}) {
  const { loginWithGoogle, loginWithApple } = useAuth();
  const pendingGoogle = useRef<PendingGoogleSignIn | null>(null);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId,
    iosClientId,
    androidClientId,
  });

  useEffect(() => {
    if (!response) return;

    if (response.type === "success") {
      const idToken = response.params.id_token;
      if (!idToken) {
        pendingGoogle.current?.reject(
          new Error("Google sign-in did not return an ID token.")
        );
        pendingGoogle.current = null;
        return;
      }
      if (!loginWithGoogle) {
        pendingGoogle.current?.reject(
          new Error("Google sign-in is not available.")
        );
        pendingGoogle.current = null;
        return;
      }

      void loginWithGoogle(idToken)
        .then(() => {
          pendingGoogle.current?.resolve();
        })
        .catch((error: unknown) => {
          pendingGoogle.current?.reject(
            error instanceof Error ? error : new Error("Google sign-in failed")
          );
        })
        .finally(() => {
          pendingGoogle.current = null;
        });
      return;
    }

    if (response.type === "error") {
      pendingGoogle.current?.reject(
        new Error(response.error?.message ?? "Google sign-in failed")
      );
      pendingGoogle.current = null;
      return;
    }

    if (response.type === "dismiss" || response.type === "cancel") {
      pendingGoogle.current?.reject(new Error("Google sign-in was cancelled"));
      pendingGoogle.current = null;
    }
  }, [response, loginWithGoogle]);

  const handlers = useMemo<OAuthHandlers>(
    () => ({
      isGoogleConfigured: true,
      isAppleConfigured: Platform.OS === "ios",

      async signInWithGoogle() {
        if (!request) {
          throw new Error("Google sign-in is still initializing. Try again.");
        }

        return new Promise<void>((resolve, reject) => {
          pendingGoogle.current = { resolve, reject };
          void promptAsync().catch((error: unknown) => {
            pendingGoogle.current?.reject(
              error instanceof Error ? error : new Error("Google sign-in failed")
            );
            pendingGoogle.current = null;
          });
        });
      },

      async signInWithApple() {
        if (!loginWithApple) {
          throw new Error("Apple sign-in is not available.");
        }
        await signInWithApple(loginWithApple);
      },
    }),
    [loginWithApple, promptAsync, request]
  );

  return <OAuthProvider handlers={handlers}>{children}</OAuthProvider>;
}

export function MobileOAuthProvider({ children }: { children: ReactNode }) {
  if (isGoogleOAuthConfigured()) {
    return (
      <MobileOAuthProviderWithGoogle>{children}</MobileOAuthProviderWithGoogle>
    );
  }

  return (
    <MobileOAuthProviderWithoutGoogle>{children}</MobileOAuthProviderWithoutGoogle>
  );
}
