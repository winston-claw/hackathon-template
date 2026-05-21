import { NextRequest, NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@app-template/app/db/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.warn("NEXT_PUBLIC_CONVEX_URL not set");
}

export async function POST(req: NextRequest) {
  if (!convexUrl) {
    return NextResponse.redirect(new URL("/login?error=missing_convex", req.url));
  }

  const formData = await req.formData();
  const webFormData = formData as unknown as globalThis.FormData;
  const identityToken = webFormData.get("id_token")?.toString();
  const userJson = webFormData.get("user")?.toString();
  let email: string | undefined;
  let name: string | undefined;
  if (userJson) {
    try {
      const user = JSON.parse(userJson) as { email?: string; name?: { firstName?: string; lastName?: string } };
      email = user.email;
      const first = user.name?.firstName ?? "";
      const last = user.name?.lastName ?? "";
      name = [first, last].filter(Boolean).join(" ") || undefined;
    } catch {
      // ignore
    }
  }

  if (!identityToken) {
    return NextResponse.redirect(new URL("/login?error=no_apple_token", req.url));
  }

  try {
    const result = await fetchMutation(
      api.auth.loginWithApple,
      { identityToken, email, name },
      { url: convexUrl }
    );
    const origin = new URL(req.url).origin;
    return NextResponse.redirect(
      new URL(`/auth/callback?token=${encodeURIComponent(result.token)}&provider=apple`, origin)
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Apple sign-in failed";
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(message)}`, req.url));
  }
}
