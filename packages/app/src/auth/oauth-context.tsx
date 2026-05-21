"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

export type OAuthHandlers = {
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  isGoogleConfigured: boolean;
  isAppleConfigured: boolean;
};

const OAuthContext = createContext<OAuthHandlers | null>(null);

export function OAuthProvider({
  handlers,
  children,
}: {
  handlers: OAuthHandlers;
  children: ReactNode;
}) {
  return (
    <OAuthContext.Provider value={handlers}>{children}</OAuthContext.Provider>
  );
}

/** Native OAuth handlers from the platform shell (Expo). Null on web. */
export function useOAuth(): OAuthHandlers | null {
  return useContext(OAuthContext);
}
