"use client";

import { useEffect } from "react";

export default function AuthApplePage() {
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_APPLE_SERVICE_ID;
    const redirectUri = typeof window !== "undefined"
      ? `${window.location.origin}/api/auth/callback/apple`
      : "";

    if (!clientId || !redirectUri) {
      window.location.href = "/login?error=missing_apple_config";
      return;
    }

    const state = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "apple-state";
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "id_token",
      response_mode: "form_post",
      scope: "name email",
      state,
    });
    window.location.href = `https://appleid.apple.com/auth/authorize?${params.toString()}`;
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      Redirecting to Apple…
    </div>
  );
}
