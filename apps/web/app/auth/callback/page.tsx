"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../lib/auth";

const AUTH_TOKEN_KEY = "auth_token";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const provider = searchParams.get("provider");

    if (token && provider === "apple") {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
      router.replace("/dashboard");
      return;
    }

    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const hashParams = new URLSearchParams(hash.slice(1));
    const idToken = hashParams.get("id_token");

    if (idToken && loginWithGoogle) {
      loginWithGoogle(idToken)
        .then(() => router.replace("/dashboard"))
        .catch((err) => setError(err instanceof Error ? err.message : "Sign-in failed"));
      return;
    }

    if (!idToken && !token) {
      setError("No token received from provider.");
    }
  }, [searchParams, router, loginWithGoogle]);

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "#dc2626" }}>{error}</p>
        <a href="/login" style={{ color: "#2563eb" }}>Back to login</a>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      Completing sign-in…
    </div>
  );
}
