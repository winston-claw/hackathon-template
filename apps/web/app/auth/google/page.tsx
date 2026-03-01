"use client";

import { useEffect } from "react";

const GOOGLE_AUTH_PARAMS = {
  client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  redirect_uri: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "",
  response_type: "id_token",
  scope: "openid email profile",
  nonce: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "default-nonce",
};

export default function AuthGooglePage() {
  useEffect(() => {
    if (!GOOGLE_AUTH_PARAMS.client_id || !GOOGLE_AUTH_PARAMS.redirect_uri) {
      window.location.href = "/login?error=missing_google_config";
      return;
    }
    const params = new URLSearchParams(GOOGLE_AUTH_PARAMS as Record<string, string>);
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      Redirecting to Google…
    </div>
  );
}
