#!/usr/bin/env node

/**
 * Project init CLI: bootstraps a new project from this template.
 * Requires CONVEX_TOKEN and VERCEL_TOKEN in the environment.
 *
 * Usage:
 *   node scripts/init.mjs                    full init (create projects, rename, deploy, auth)
 *   node scripts/init.mjs --auth=none         skip Google/Apple OAuth setup
 *   node scripts/init.mjs --auth=google       only run Google OAuth provisioning
 *   node scripts/init.mjs --auth=apple        only run Apple OAuth provisioning
 *   node scripts/init.mjs --auth=all          run both Google and Apple (default)
 *   node scripts/init.mjs --deploy            deploy only (Convex + Vercel)
 *
 * Or: npm run init   /   npm run deploy
 */

import { createInterface } from "readline";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const INIT_AUTH_DIR = path.join(ROOT, ".init", "auth");

const DEPLOY_ONLY = process.argv.includes("--deploy");
const AUTH_ARG = process.argv.find((a) => a.startsWith("--auth="));
const AUTH_MODE = AUTH_ARG ? AUTH_ARG.split("=")[1] : "all"; // none | google | apple | all

const rl = createInterface({ input: process.stdin, output: process.stdout });
const question = (q) => new Promise((resolve) => rl.question(q, resolve));

function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function compact(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: opts.cwd || ROOT,
      stdio: opts.stdio ?? "pipe",
      shell: true,
      env: opts.env ? { ...process.env, ...opts.env } : process.env,
    });
    let out = "";
    let err = "";
    if (child.stdout) child.stdout.on("data", (d) => (out += d.toString()));
    if (child.stderr) child.stderr.on("data", (d) => (err += d.toString()));
    child.on("exit", (code) => {
      if (code === 0) resolve({ stdout: out, stderr: err });
      else reject(new Error(err || out || `exit ${code}`));
    });
  });
}

async function preflightChecks(authMode) {
  if (authMode === "none") return;
  if (authMode === "google" || authMode === "all") {
    try {
      await run("gcloud", ["--version"]);
    } catch (e) {
      console.error("Google auth requires gcloud CLI. Install: https://cloud.google.com/sdk/docs/install");
      process.exit(1);
    }
  }
  if (authMode === "apple" || authMode === "all") {
    // Optional: fastlane for Apple. Don't fail if missing; we have manual checklist.
  }
}

async function runDeployOnly() {
  console.log("Deploy only – Convex + Vercel\n");

  const vercelToken = process.env.VERCEL_TOKEN;
  if (!vercelToken) {
    console.error("Missing VERCEL_TOKEN. Set it for Vercel deploy.");
    process.exit(1);
  }

  console.log("Deploying to Convex...");
  try {
    await new Promise((resolve, reject) => {
      const child = spawn("npx", ["convex", "deploy"], {
        cwd: ROOT,
        stdio: "inherit",
        shell: true,
      });
      child.on("exit", (code) =>
        code === 0 ? resolve() : reject(new Error("convex deploy failed"))
      );
    });
    console.log("Convex deploy done.");
  } catch (e) {
    console.error("Convex deploy failed:", e.message);
    process.exit(1);
  }

  const webDir = path.join(ROOT, "apps/web");
  console.log("\nDeploying to Vercel...");
  try {
    await new Promise((resolve, reject) => {
      const child = spawn(
        "npx",
        ["vercel", "deploy", "--prod", "--yes"],
        {
          cwd: webDir,
          stdio: "inherit",
          shell: true,
          env: { ...process.env, VERCEL_TOKEN: vercelToken },
        }
      );
      child.on("exit", (code) =>
        code === 0 ? resolve() : reject(new Error("vercel deploy failed"))
      );
    });
    console.log("Vercel deploy done.");
  } catch (e) {
    console.error("Vercel deploy failed:", e.message);
    process.exit(1);
  }

  console.log("\nDone.");
}

async function runGoogleProvisioning(slug, displayName, vercelProjectUrl) {
  const gcpProjectId = slug.replace(/-/g, "").slice(0, 30) || slug; // GCP project ID: letters, numbers, hyphens; 6-30 chars
  console.log("\n--- Google OAuth setup ---");
  console.log("Using GCP project ID:", gcpProjectId);

  try {
    await run("gcloud", ["projects", "create", gcpProjectId, "--name=" + displayName.trim().slice(0, 100)]);
  } catch (e) {
    // Project may already exist
    if (!e.message.includes("already exists")) console.warn("gcloud projects create:", e.message);
  }

  try {
    await run("gcloud", ["config", "set", "project", gcpProjectId]);
  } catch (e) {
    console.warn("gcloud config set project:", e.message);
  }

  const credentialsUrl = `https://console.cloud.google.com/apis/credentials?project=${gcpProjectId}`;
  console.log("\nCreate OAuth 2.0 credentials in the Cloud Console:");
  console.log(credentialsUrl);
  console.log("1. Configure OAuth consent screen (External, add your email as test user if needed).");
  console.log("2. Create credential > OAuth client ID > Web application.");
  console.log("   Authorized redirect URIs: " + (vercelProjectUrl ? `${vercelProjectUrl}/api/auth/callback/google` : "https://YOUR_VERCEL_URL/api/auth/callback/google"));
  console.log("3. Create credential > OAuth client ID > Android (package name from app.json) and/or iOS (bundle ID) if needed for mobile.\n");

  const webClientId = await question("Paste your Web application Client ID: ");
  const webClientSecret = await question("Paste your Web application Client secret: ");
  const androidClientId = await question("Android OAuth Client ID (optional, press Enter to skip): ").then((s) => s.trim() || null);
  const iosClientId = await question("iOS OAuth Client ID (optional, press Enter to skip): ").then((s) => s.trim() || null);

  if (!webClientId.trim()) {
    console.warn("No Web Client ID provided; skipping Google auth persistence.");
    return null;
  }

  await fs.mkdir(INIT_AUTH_DIR, { recursive: true });
  const data = {
    gcpProjectId,
    webClientId: webClientId.trim(),
    webClientSecret: webClientSecret.trim() || null,
    androidClientId,
    iosClientId,
  };
  await fs.writeFile(
    path.join(INIT_AUTH_DIR, "google.generated.json"),
    JSON.stringify(data, null, 2)
  );
  console.log("Saved to .init/auth/google.generated.json");
  return data;
}

async function runAppleProvisioning(slug, bundlePrefix) {
  console.log("\n--- Apple Sign In setup (semi-automated) ---");

  const teamId = await question("Apple Team ID (e.g. ABCD1234): ");
  const keyId = await question("Apple Key ID (Sign in with Apple key): ");
  const serviceId = await question("Apple Service ID for web (e.g. com.myapp.service): ").then((s) => s.trim() || `${bundlePrefix}.service`);
  const keyPath = await question("Path to .p8 private key file (or Enter to skip): ").then((s) => s.trim() || null);

  let privateKeyP8 = null;
  if (keyPath) {
    try {
      privateKeyP8 = await fs.readFile(keyPath, "utf8");
      privateKeyP8 = privateKeyP8.replace(/\r\n/g, "\n").trim();
    } catch (e) {
      console.warn("Could not read key file:", e.message);
    }
  }

  const checklist = `
Manual Apple steps (if not done yet):
1. developer.apple.com > Certificates, Identifiers & Profiles > Identifiers: create an App ID with "Sign in with Apple" capability (Bundle ID: ${bundlePrefix}.mobile).
2. Create a Services ID for web (e.g. ${serviceId}), enable "Sign in with Apple", configure domains and redirect URLs.
3. Create a Key with "Sign in with Apple" enabled; download the .p8 and note the Key ID.
4. Link the key to your primary App ID (or the Services ID) as needed.
`;
  console.log(checklist);

  const data = {
    teamId: teamId.trim(),
    keyId: keyId.trim(),
    serviceId: serviceId.trim(),
    bundleId: `${bundlePrefix}.mobile`,
    privateKeyP8,
  };
  await fs.mkdir(INIT_AUTH_DIR, { recursive: true });
  await fs.writeFile(
    path.join(INIT_AUTH_DIR, "apple.generated.json"),
    JSON.stringify({ ...data, privateKeyP8: data.privateKeyP8 ? "[REDACTED]" : null }, null, 2)
  );
  // Write actual key to a separate file that is gitignored
  if (privateKeyP8) {
    await fs.writeFile(path.join(INIT_AUTH_DIR, "apple_private_key.p8"), privateKeyP8);
    console.log("Saved key to .init/auth/apple_private_key.p8 (add .init/ to .gitignore)");
  }
  console.log("Saved metadata to .init/auth/apple.generated.json");
  return { ...data, privateKeyP8 };
}

async function main() {
  if (DEPLOY_ONLY) {
    await runDeployOnly();
    rl.close();
    return;
  }

  console.log("Project init – Convex + Vercel + template renames + OAuth\n");

  const convexToken = process.env.CONVEX_TOKEN;
  const vercelToken = process.env.VERCEL_TOKEN;
  if (!convexToken) {
    console.error("Missing CONVEX_TOKEN. Set it and run again.");
    process.exit(1);
  }
  if (!vercelToken) {
    console.error("Missing VERCEL_TOKEN. Set it and run again.");
    process.exit(1);
  }

  const authMode = AUTH_MODE;
  await preflightChecks(authMode);

  const displayName = await question("Project display name (e.g. My Awesome App): ");
  if (!displayName.trim()) {
    console.error("Display name is required.");
    process.exit(1);
  }

  const slug = slugify(displayName);
  const compactName = compact(displayName);
  const defaultBundlePrefix = `com.${compactName}`;
  const bundlePrefix = await question(
    `Bundle ID prefix (e.g. com.mycompany) [${defaultBundlePrefix}]: `
  ).then((s) => (s.trim() ? s.trim() : defaultBundlePrefix));

  console.log("\nDerived:");
  console.log("  slug:", slug);
  console.log("  scope:", `@${slug}`);
  console.log("  bundle prefix:", bundlePrefix);
  console.log("  auth:", authMode);
  console.log("");

  // --- Convex: get team ID then create project ---
  let convexUrl = null;
  let deploymentName = null;
  try {
    const tokenRes = await fetch("https://api.convex.dev/v1/token_details", {
      headers: { Authorization: `Bearer ${convexToken}` },
    });
    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      throw new Error(`Convex token_details failed: ${tokenRes.status} ${t}`);
    }
    const tokenData = await tokenRes.json();
    const teamId = tokenData.teamId;
    if (!teamId) {
      throw new Error("Convex token_details did not return teamId");
    }

    const createRes = await fetch(
      `https://api.convex.dev/v1/teams/${teamId}/create_project`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${convexToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: displayName.trim(),
          deploymentType: "dev",
        }),
      }
    );
    if (!createRes.ok) {
      const t = await createRes.text();
      throw new Error(`Convex create_project failed: ${createRes.status} ${t}`);
    }
    const createData = await createRes.json();
    convexUrl = createData.deploymentUrl || null;
    deploymentName = createData.deploymentName || null;
    if (convexUrl) {
      console.log("Convex project created. Deployment URL:", convexUrl);
    } else {
      console.log("Convex project created (no deployment URL in response).");
    }
  } catch (e) {
    console.error("Convex setup failed:", e.message);
    process.exit(1);
  }

  // --- Vercel: create project ---
  let vercelProjectUrl = null;
  try {
    const vercelRes = await fetch("https://api.vercel.com/v9/projects", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: slug, framework: "nextjs" }),
    });
    if (!vercelRes.ok) {
      const t = await vercelRes.text();
      throw new Error(`Vercel create project failed: ${vercelRes.status} ${t}`);
    }
    const vercelData = await vercelRes.json();
    vercelProjectUrl = vercelData.project?.projectId ? `https://${slug}.vercel.app` : null;
    console.log("Vercel project created:", vercelData.name || slug);
  } catch (e) {
    console.error("Vercel setup failed:", e.message);
    process.exit(1);
  }

  // --- Replacements ---
  const replacements = [
    ["project-template", slug],
    ["Project Template", displayName.trim()],
    ["project template", displayName.trim().toLowerCase()],
    ["projecttemplate", compactName],
    ["com.projecttemplate", bundlePrefix],
    ["@project-template/auth", `@${slug}/auth`],
    ["@project-template/db", `@${slug}/db`],
  ];

  const filesToReplace = [
    path.join(ROOT, "package.json"),
    path.join(ROOT, "packages/auth/package.json"),
    path.join(ROOT, "packages/db/package.json"),
    path.join(ROOT, "apps/web/package.json"),
    path.join(ROOT, "apps/mobile/package.json"),
    path.join(ROOT, "apps/web/next.config.mjs"),
    path.join(ROOT, "apps/mobile/app.json"),
    path.join(ROOT, "apps/web/app/layout.tsx"),
    path.join(ROOT, "apps/web/app/page.tsx"),
    path.join(ROOT, "apps/mobile/app/index.tsx"),
    path.join(ROOT, "README.md"),
    path.join(ROOT, "apps/web/lib/convex-client.ts"),
    path.join(ROOT, "apps/web/lib/auth.tsx"),
    path.join(ROOT, "apps/mobile/lib/convex.ts"),
    path.join(ROOT, "apps/mobile/lib/auth.tsx"),
    path.join(ROOT, "apps/web/app/api/auth/callback/apple/route.ts"),
  ];

  for (const filePath of filesToReplace) {
    try {
      let content = await fs.readFile(filePath, "utf8");
      for (const [from, to] of replacements) {
        content = content.split(from).join(to);
      }
      await fs.writeFile(filePath, content);
    } catch (e) {
      if (e.code === "ENOENT") {
        continue;
      }
      console.error("Failed to update", filePath, e.message);
    }
  }

  // app.json: set name (display), slug (slug-mobile), scheme (slug), bundleIdentifier, package, OAuth plugins
  const appJsonPath = path.join(ROOT, "apps/mobile/app.json");
  try {
    const appJson = JSON.parse(
      await fs.readFile(appJsonPath, "utf8")
    );
    const expo = appJson.expo || {};
    expo.name = `${displayName.trim()} Mobile`;
    expo.slug = `${slug}-mobile`;
    expo.scheme = slug;
    if (expo.ios) expo.ios.bundleIdentifier = `${bundlePrefix}.mobile`;
    if (expo.android) expo.android.package = `${bundlePrefix}.mobile`;
    if (!expo.plugins) expo.plugins = [];
    if (!expo.plugins.includes("expo-apple-authentication")) {
      expo.plugins.push("expo-apple-authentication");
    }
    appJson.expo = expo;
    await fs.writeFile(appJsonPath, JSON.stringify(appJson, null, 2));
  } catch (e) {
    console.error("Failed to update app.json:", e.message);
  }

  // --- OAuth provisioning (Google + Apple) ---
  let googleAuth = null;
  let appleAuth = null;
  if (authMode === "google" || authMode === "all") {
    googleAuth = await runGoogleProvisioning(slug, displayName, vercelProjectUrl);
  }
  if (authMode === "apple" || authMode === "all") {
    appleAuth = await runAppleProvisioning(slug, bundlePrefix);
  }

  // --- Write env files (Convex URL + OAuth vars) ---
  const webEnvLines = [];
  const mobileEnvLines = [];
  if (convexUrl) {
    webEnvLines.push(`NEXT_PUBLIC_CONVEX_URL=${convexUrl}`);
    mobileEnvLines.push(`EXPO_PUBLIC_CONVEX_URL=${convexUrl}`);
  }
  if (googleAuth) {
    webEnvLines.push(`NEXT_PUBLIC_GOOGLE_CLIENT_ID=${googleAuth.webClientId}`);
    mobileEnvLines.push(`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=${googleAuth.webClientId}`);
    if (googleAuth.androidClientId) mobileEnvLines.push(`EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=${googleAuth.androidClientId}`);
    if (googleAuth.iosClientId) mobileEnvLines.push(`EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=${googleAuth.iosClientId}`);
  }
  if (appleAuth) {
    webEnvLines.push(`NEXT_PUBLIC_APPLE_SERVICE_ID=${appleAuth.serviceId}`);
    mobileEnvLines.push(`EXPO_PUBLIC_APPLE_SERVICE_ID=${appleAuth.serviceId}`);
  }

  if (webEnvLines.length) {
    await fs.writeFile(path.join(ROOT, "apps/web/.env.local"), webEnvLines.join("\n") + "\n");
    console.log("Wrote apps/web/.env.local");
  }
  if (mobileEnvLines.length) {
    await fs.writeFile(path.join(ROOT, "apps/mobile/.env"), mobileEnvLines.join("\n") + "\n");
    console.log("Wrote apps/mobile/.env");
  }

  // --- Vercel env vars (public only) ---
  if (convexUrl) {
    try {
      await fetch(`https://api.vercel.com/v10/projects/${encodeURIComponent(slug)}/env`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "NEXT_PUBLIC_CONVEX_URL",
          value: convexUrl,
          type: "plain",
          target: ["production", "preview", "development"],
        }),
      });
    } catch (e) {
      console.warn("Vercel env var failed (continuing):", e.message);
    }
  }
  if (googleAuth) {
    try {
      await fetch(`https://api.vercel.com/v10/projects/${encodeURIComponent(slug)}/env`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
          value: googleAuth.webClientId,
          type: "plain",
          target: ["production", "preview", "development"],
        }),
      });
    } catch (e) {
      console.warn("Vercel Google env failed:", e.message);
    }
  }
  if (appleAuth) {
    try {
      await fetch(`https://api.vercel.com/v10/projects/${encodeURIComponent(slug)}/env`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "NEXT_PUBLIC_APPLE_SERVICE_ID",
          value: appleAuth.serviceId,
          type: "plain",
          target: ["production", "preview", "development"],
        }),
      });
    } catch (e) {
      console.warn("Vercel Apple env failed:", e.message);
    }
  }

  console.log("\nRunning npm install...");
  await new Promise((resolve, reject) => {
    const child = spawn("npm", ["install"], {
      cwd: ROOT,
      stdio: "inherit",
      shell: true,
    });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("npm install failed"))));
  });

  // --- Deploy to Convex ---
  if (deploymentName && convexUrl) {
    console.log("\nDeploying to Convex...");
    try {
      const keyRes = await fetch(
        `https://api.convex.dev/v1/deployments/${encodeURIComponent(deploymentName)}/create_deploy_key`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${convexToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: "init-script" }),
        }
      );
      if (!keyRes.ok) {
        const t = await keyRes.text();
        throw new Error(`Convex create_deploy_key failed: ${keyRes.status} ${t}`);
      }
      const keyData = await keyRes.json();
      const deployKey = keyData.deployKey;
      if (!deployKey) throw new Error("No deployKey in response");

      await new Promise((resolve, reject) => {
        const child = spawn("npx", ["convex", "deploy"], {
          cwd: ROOT,
          stdio: "inherit",
          shell: true,
          env: { ...process.env, CONVEX_DEPLOY_KEY: deployKey },
        });
        child.on("exit", (code) =>
          code === 0 ? resolve() : reject(new Error("convex deploy failed"))
        );
      });
      console.log("Convex deploy done.");

      // Set Convex env vars for OAuth secrets (backend only)
      const convexEnv = { ...process.env, CONVEX_DEPLOY_KEY: deployKey };
      if (googleAuth?.webClientSecret) {
        await new Promise((resolve, reject) => {
          const child = spawn("npx", ["convex", "env", "set", "GOOGLE_CLIENT_SECRET", googleAuth.webClientSecret], {
            cwd: ROOT,
            stdio: "pipe",
            shell: true,
            env: convexEnv,
          });
          child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("convex env set failed"))));
        }).catch((e) => console.warn("Convex GOOGLE_CLIENT_SECRET env set failed:", e.message));
      }
      if (appleAuth?.privateKeyP8 && appleAuth.teamId && appleAuth.keyId) {
        const applePrivateKeyEscaped = appleAuth.privateKeyP8.replace(/\n/g, "\\n");
        await new Promise((resolve, reject) => {
          const child = spawn("npx", ["convex", "env", "set", "APPLE_TEAM_ID", appleAuth.teamId], {
            cwd: ROOT,
            stdio: "pipe",
            shell: true,
            env: convexEnv,
          });
          child.on("exit", (code) => (code === 0 ? resolve() : reject()));
        }).catch(() => {});
        await new Promise((resolve, reject) => {
          const child = spawn("npx", ["convex", "env", "set", "APPLE_KEY_ID", appleAuth.keyId], {
            cwd: ROOT,
            stdio: "pipe",
            shell: true,
            env: convexEnv,
          });
          child.on("exit", (code) => (code === 0 ? resolve() : reject()));
        }).catch(() => {});
        await new Promise((resolve, reject) => {
          const child = spawn("npx", ["convex", "env", "set", "APPLE_PRIVATE_KEY", applePrivateKeyEscaped], {
            cwd: ROOT,
            stdio: "pipe",
            shell: true,
            env: convexEnv,
          });
          child.on("exit", (code) => (code === 0 ? resolve() : reject()));
        }).catch(() => {});
      }
    } catch (e) {
      console.error("Convex deploy failed:", e.message);
    }
  }

  console.log("\nDeploying to Vercel...");
  const webDir = path.join(ROOT, "apps/web");
  try {
    await new Promise((resolve, reject) => {
      const child = spawn(
        "npx",
        ["vercel", "link", "--project", slug, "--yes"],
        {
          cwd: webDir,
          stdio: "inherit",
          shell: true,
          env: { ...process.env, VERCEL_TOKEN: vercelToken },
        }
      );
      child.on("exit", (code) =>
        code === 0 ? resolve() : reject(new Error("vercel link failed"))
      );
    });
    await new Promise((resolve, reject) => {
      const child = spawn(
        "npx",
        ["vercel", "deploy", "--prod", "--yes"],
        {
          cwd: webDir,
          stdio: "inherit",
          shell: true,
          env: { ...process.env, VERCEL_TOKEN: vercelToken },
        }
      );
      child.on("exit", (code) =>
        code === 0 ? resolve() : reject(new Error("vercel deploy failed"))
      );
    });
    console.log("Vercel deploy done.");
  } catch (e) {
    console.error("Vercel deploy failed:", e.message);
  }

  // --- Verification output ---
  console.log("\nDone. Next steps:");
  console.log("  1. Run: npm run dev  (web) or npm run dev:mobile (mobile)");
  if (authMode !== "none" && (googleAuth || appleAuth)) {
    console.log("  2. OAuth: Add callback routes (e.g. /api/auth/callback/google) and wire provider buttons on login/signup.");
    if (appleAuth && !appleAuth.privateKeyP8) {
      console.log("  3. Apple: Complete manual steps above and set APPLE_PRIVATE_KEY in Convex env.");
    }
  }
  rl.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
