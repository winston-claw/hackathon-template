import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Simple hash function
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Sign up mutation
export const signup = mutation({
  args: { name: v.string(), email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("User already exists");
    }

    const passwordHash = await hashPassword(args.password);

    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      passwordHash,
      createdAt: Date.now(),
    });

    const token = generateToken();
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    await ctx.db.insert("sessions", {
      userId,
      token,
      expiresAt,
    });

    return { userId, token, name: args.name };
  },
});

// Login mutation
export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.passwordHash === undefined) {
      throw new Error("This account uses a sign-in provider; use Google or Apple to sign in.");
    }

    const passwordHash = await hashPassword(args.password);
    if (user.passwordHash !== passwordHash) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken();
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
    });

    return { userId: user._id, token, name: user.name };
  },
});

// Me query
export const me = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.userId);
    if (!user) {
      return null;
    }

    return { userId: user._id, name: user.name, email: user.email };
  },
});

// Logout mutation
export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    return true;
  },
});

// --- OAuth: Google (verify id_token via tokeninfo) ---
export const loginWithGoogle = mutation({
  args: { idToken: v.string() },
  handler: async (ctx, args) => {
    const res = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(args.idToken)}`
    );
    if (!res.ok) {
      throw new Error("Invalid Google token");
    }
    const data = (await res.json()) as {
      email?: string;
      name?: string;
      sub: string;
    };
    const email = data.email ?? "";
    const name = data.name ?? data.email ?? "User";
    const providerUserId = data.sub;

    let user = await ctx.db
      .query("users")
      .withIndex("by_provider", (q) =>
        q.eq("provider", "google").eq("providerUserId", providerUserId)
      )
      .first();

    if (!user) {
      const existingByEmail = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();
      if (existingByEmail) {
        throw new Error("An account with this email already exists. Sign in with email/password or link the provider.");
      }
      const userId = await ctx.db.insert("users", {
        name,
        email,
        provider: "google",
        providerUserId,
        createdAt: Date.now(),
      });
      user = (await ctx.db.get(userId))!;
    }

    const token = generateToken();
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
    });

    return { userId: user._id, token, name: user.name };
  },
});

// --- OAuth: Apple (verify identity_token JWT, then find/create user) ---
function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(base64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

async function verifyAppleIdentityToken(identityToken: string): Promise<{ sub: string; email?: string }> {
  const parts = identityToken.split(".");
  if (parts.length !== 3) throw new Error("Invalid Apple identity token");
  const [headerB64, payloadB64] = parts;
  const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(headerB64))) as { kid: string; alg: string };
  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64))) as {
    sub: string;
    email?: string;
    exp: number;
    iss: string;
  };

  if (payload.iss !== "https://appleid.apple.com") throw new Error("Invalid issuer");
  if (payload.exp * 1000 < Date.now()) throw new Error("Token expired");

  const keysRes = await fetch("https://appleid.apple.com/auth/keys");
  if (!keysRes.ok) throw new Error("Failed to fetch Apple keys");
  const keysData = (await keysRes.json()) as { keys: Array<{ kid: string; n: string; e: string }> };
  const jwk = keysData.keys.find((k) => k.kid === header.kid);
  if (!jwk) throw new Error("Apple key not found");

  const cryptoKey = await crypto.subtle.importKey(
    "jwk",
    { kty: "RSA", n: jwk.n, e: jwk.e, alg: "RS256" },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const signature = base64UrlDecode(parts[2]);
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, signature, data);
  if (!ok) throw new Error("Invalid Apple signature");

  return { sub: payload.sub, email: payload.email };
}

export const loginWithApple = mutation({
  args: {
    identityToken: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payload = await verifyAppleIdentityToken(args.identityToken);
    const providerUserId = payload.sub;
    const email = payload.email ?? args.email ?? "";
    const name = args.name ?? (email || "User");

    let user = await ctx.db
      .query("users")
      .withIndex("by_provider", (q) =>
        q.eq("provider", "apple").eq("providerUserId", providerUserId)
      )
      .first();

    if (!user) {
      const existingByEmail = email
        ? await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", email))
            .first()
        : null;
      if (existingByEmail) {
        throw new Error("An account with this email already exists.");
      }
      const userId = await ctx.db.insert("users", {
        name,
        email: email || `${providerUserId}@privaterelay.appleid.com`,
        provider: "apple",
        providerUserId,
        createdAt: Date.now(),
      });
      user = (await ctx.db.get(userId))!;
    }

    const token = generateToken();
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
    });

    return { userId: user._id, token, name: user.name };
  },
});
