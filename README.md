# project template

A production-ready project starter template with Next.js 14, Expo (React Native), Convex (auth + database), and Tailwind CSS. Web and mobile share the same Convex backend and auth logic.

## Features

- **Next.js 14** - App Router, TypeScript, Server Components
- **Expo 54** - React Native app with Expo Router (iOS, Android, web); React 19, RN 0.81
- **Convex** - Real-time database + auth (signup, login, sessions, Google/Apple OAuth)
- **Shared auth** - `@project-template/auth` with platform adapters (localStorage / SecureStore) and optional Google/Apple sign-in
- **Tailwind CSS** - Utility-first styling (web)
- **Vercel** - Production-ready deployment (web)

## Initializing a new project from this template

To create a new project with its own Convex deployment, Vercel project, and optional Google/Apple OAuth setup:

### Prerequisites

- **Convex**: Team Access Token from [Convex dashboard](https://dashboard.convex.dev).
- **Vercel**: [Vercel token](https://vercel.com/account/tokens).
- **Google OAuth (optional)**: [gcloud CLI](https://cloud.google.com/sdk/docs/install) installed and authenticated (`gcloud auth login`). Used to create a GCP project and prompt you to create OAuth client credentials.

### Run init

1. **Set tokens:**
   ```bash
   export CONVEX_TOKEN="your-convex-team-token"
   export VERCEL_TOKEN="your-vercel-token"
   ```
2. **Run the init script:**
   ```bash
   npm run init
   ```
3. When prompted, enter the **project display name** (e.g. `My Awesome App`) and optionally the **bundle ID prefix** (e.g. `com.mycompany`; default is `com.<slug>`).
4. If you keep **auth** enabled (default), you will be guided through:
   - **Google**: A GCP project is created; you create OAuth clients in the Cloud Console (URL printed) and paste the Web Client ID and secret (and optionally Android/iOS client IDs). These are saved to `.init/auth/google.generated.json` and written into env files.
   - **Apple**: You are prompted for Apple Team ID, Key ID, Service ID, and path to your `.p8` private key. A manual checklist is printed for portal-only steps (App ID, Services ID, Key creation). Values are saved to `.init/auth/apple.generated.json` and (if key path is given) `.init/auth/apple_private_key.p8`. Add `.init/` to `.gitignore` (already done) so secrets are not committed.

### Auth options

- `npm run init` — full init including Google and Apple OAuth provisioning (default).
- `npm run init -- --auth=none` — skip OAuth setup.
- `npm run init -- --auth=google` — only run Google OAuth setup.
- `npm run init -- --auth=apple` — only run Apple OAuth setup.

The script creates the Convex project (with a dev deployment), Vercel project, renames the template everywhere, sets Expo app name/slug/scheme and iOS/Android bundle IDs, writes env files (Convex URL and OAuth client IDs), runs `npm install`, deploys Convex (and sets OAuth secrets in Convex env), and deploys the web app to Vercel.

To deploy again after init (without re-creating projects or re-prompting), run **`npm run deploy`** (or `npm run init -- --deploy`). You need `VERCEL_TOKEN` set; Convex uses your existing link from `convex dev` or `CONVEX_DEPLOY_KEY`.

### Apple Sign In – manual steps

If you did not provide a key file during init, or need to re-create credentials:

1. [developer.apple.com](https://developer.apple.com) → Certificates, Identifiers & Profiles → **Identifiers**: create an **App ID** with "Sign in with Apple" (Bundle ID = your app’s bundle ID, e.g. `com.mycompany.mobile`).
2. Create a **Services ID** for web (e.g. `com.mycompany.service`), enable "Sign in with Apple", set domains and redirect URLs to your web app (e.g. `https://yourapp.vercel.app/api/auth/callback/apple`).
3. Create a **Key** with "Sign in with Apple" enabled; download the `.p8` and note the **Key ID**. Link the key to your primary App ID or Services ID.
4. Set Convex env (or re-run init with key path): `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` (contents of the `.p8`, newlines as `\n`).

## Quick Start

```bash
# Clone the repo
git clone https://github.com/winston-claw/project-template.git
cd project-template

# Optional: run npm run init (see above) to create a new Convex + Vercel project and rename the app

# Install dependencies (monorepo: installs all workspaces)
npm install

# Set up Convex (run from repo root)
npm run convex:dev
# Or: npx convex dev

# Run web app
npm run dev
# Or: npm run dev:web

# Run mobile app (separate terminal)
npm run dev:mobile
```

## Convex Setup

1. Run `npm run convex:dev` (or `npx convex dev`) from the repo root and authenticate with your browser.
2. The Convex backend (in `convex/`) deploys to a dev URL automatically.
3. Copy your Convex deployment URL for environment variables.

### Environment Variables

**Web (Next.js)** – create `apps/web/.env.local` or root `.env.local`:

```
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

**Mobile (Expo)** – create `apps/mobile/.env` or use the same in a shared `.env`:

```
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

Use the same Convex deployment URL for both apps so they share the same database and auth.

## Project Structure

```
project-template/
├── apps/
│   ├── web/                 # Next.js app
│   │   ├── app/             # App Router (login, signup, dashboard)
│   │   ├── lib/             # Auth + Convex client (uses shared packages)
│   │   └── convex/          # Generated Convex types
│   └── mobile/             # Expo app (Expo Router)
│       ├── app/             # Screens (index, login, signup, dashboard)
│       └── lib/              # Auth + Convex client (uses shared packages)
├── packages/
│   ├── auth/                # Shared auth: createAuthProvider, token stores
│   │   └── adapters/        # Web (localStorage), Mobile (expo-secure-store)
│   └── db/                  # Shared Convex client (createConvexClient)
├── convex/                  # Convex backend (canonical)
│   ├── schema.ts
│   └── auth.ts
├── convex.json
├── package.json             # Workspaces + root scripts
└── tsconfig.base.json
```

## Authentication

- **Web**: `/signup`, `/login`, `/dashboard` (protected). Email/password plus **Sign in with Google** and **Sign in with Apple**. Token in `localStorage`.
- **Mobile**: Same flows; token in `expo-secure-store`. Google (via in-app browser) and Apple (native `expo-apple-authentication` on iOS).

Auth is implemented in `convex/auth.ts` (email/password plus `loginWithGoogle` and `loginWithApple` mutations) and shared UI in `@project-template/auth` with platform-specific token storage. OAuth client IDs and secrets are set by `npm run init` when you choose auth setup; configure redirect URIs in Google and Apple consoles to match your app (see Apple manual steps above).

## Scripts (root)

| Script | Description |
|--------|-------------|
| `npm run init` | Create new Convex + Vercel project, rename template, write env files, deploy Convex + Vercel (requires `CONVEX_TOKEN`, `VERCEL_TOKEN`) |
| `npm run deploy` | Deploy Convex backend and web app to Vercel (for already-inited projects; requires `VERCEL_TOKEN`, Convex linked via `convex dev` or `CONVEX_DEPLOY_KEY`) |
| `npm run dev` / `npm run dev:web` | Start Next.js dev server |
| `npm run dev:mobile` | Start Expo dev server |
| `npm run convex:dev` | Run Convex dev (backend + codegen) |
| `npm run convex:deploy` | Deploy Convex backend |
| `npm run typecheck` | Typecheck web + packages (mobile skipped due to React 19 / RN type conflict; run `cd apps/mobile && npx tsc --noEmit` to check mobile) |
| `npm run lint` | Lint all workspaces |

## Deployment

### Web (Vercel)

1. Import the repo on Vercel (use `apps/web` as root if required).
2. Set `NEXT_PUBLIC_CONVEX_URL`.
3. Deploy.

### Convex

From repo root:

```bash
npm run convex:deploy
```

### Mobile

Build with EAS or Expo application services; set `EXPO_PUBLIC_CONVEX_URL` in your build environment.

## Tech Stack

- [Next.js 14](https://nextjs.org/)
- [Expo](https://expo.dev/) (React Native)
- [Convex](https://convex.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## License

MIT
