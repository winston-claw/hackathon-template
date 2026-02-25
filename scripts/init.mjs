#!/usr/bin/env node

/**
 * Project init CLI: bootstraps a new project from this template.
 * Requires CONVEX_TOKEN and VERCEL_TOKEN in the environment.
 *
 * Usage:
 *   node scripts/init.mjs           full init (create projects, rename, deploy)
 *   node scripts/init.mjs --deploy   deploy only (Convex + Vercel), for already-inited projects
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

const DEPLOY_ONLY = process.argv.includes("--deploy");

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

async function main() {
  if (DEPLOY_ONLY) {
    await runDeployOnly();
    return;
  }

  console.log("Project init – Convex + Vercel + template renames\n");

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

  // app.json: set name (display), slug (slug-mobile), scheme (slug), bundleIdentifier, package
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
    appJson.expo = expo;
    await fs.writeFile(appJsonPath, JSON.stringify(appJson, null, 2));
  } catch (e) {
    console.error("Failed to update app.json:", e.message);
  }

  // Write env files if we have a Convex URL
  if (convexUrl) {
    const webEnv = path.join(ROOT, "apps/web/.env.local");
    const mobileEnv = path.join(ROOT, "apps/mobile/.env");
    const line = `NEXT_PUBLIC_CONVEX_URL=${convexUrl}\n`;
    const mobileLine = `EXPO_PUBLIC_CONVEX_URL=${convexUrl}\n`;
    await fs.writeFile(webEnv, line);
    await fs.writeFile(mobileEnv, mobileLine);
    console.log("Wrote", webEnv, "and", mobileEnv);
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
    } catch (e) {
      console.error("Convex deploy failed:", e.message);
    }
  }

  // --- Add Convex URL to Vercel project env, then deploy ---
  if (convexUrl) {
    try {
      const envRes = await fetch(
        `https://api.vercel.com/v10/projects/${encodeURIComponent(slug)}/env`,
        {
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
        }
      );
      if (!envRes.ok) {
        const t = await envRes.text();
        console.warn("Vercel env var failed (continuing):", envRes.status, t);
      }
    } catch (e) {
      console.warn("Vercel env var failed (continuing):", e.message);
    }
  }

  console.log("\nDeploying to Vercel...");
  const webDir = path.join(ROOT, "apps/web");
  try {
    // Link to the project we created so deploy goes to it
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

  console.log("\nDone. Next steps:");
  console.log("  1. Run: npm run dev  (web) or npm run dev:mobile (mobile)");
  rl.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
