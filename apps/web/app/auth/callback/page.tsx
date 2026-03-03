"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../lib/auth";

const AUTH_TOKEN_KEY = "auth_token";

function AuthCallbackContent() {
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</p>
          <a href="/login" style={{ color: '#1a1a1a', fontWeight: 700, textDecoration: 'none' }}>Back to login</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f0', fontFamily: 'Inter, system-ui, sans-serif', color: '#1a1a1a' }}>
      Completing sign-in…
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f0', fontFamily: 'Inter, system-ui, sans-serif', color: '#1a1a1a' }}>Completing sign-in…</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
