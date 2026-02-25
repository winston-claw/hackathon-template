# project template

A production-ready project starter template with Next.js 14, Expo (React Native), Convex (auth + database), and Tailwind CSS. Web and mobile share the same Convex backend and auth logic.

## Features

- **Next.js 14** - App Router, TypeScript, Server Components
- **Expo 54** - React Native app with Expo Router (iOS, Android, web); React 19, RN 0.81
- **Convex** - Real-time database + auth (signup, login, sessions)
- **Shared auth** - `@project-template/auth` with platform adapters (localStorage / SecureStore)
- **Tailwind CSS** - Utility-first styling (web)
- **Vercel** - Production-ready deployment (web)

## Initializing a new project from this template

To create a new project with its own Convex deployment and Vercel project in one go:

1. **Set tokens** (Team Access Token from [Convex dashboard](https://dashboard.convex.dev), and [Vercel token](https://vercel.com/account/tokens)):
   ```bash
   export CONVEX_TOKEN="your-convex-team-token"
   export VERCEL_TOKEN="your-vercel-token"
   ```
2. **Run the init script:**
   ```bash
   npm run init
   ```
3. When prompted, enter the **project display name** (e.g. `My Awesome App`) and optionally the **bundle ID prefix** (e.g. `com.mycompany`; default is `com.<slug>`).

The script will create a new Convex project (with a dev deployment), create a new Vercel project, replace the template name and package scope everywhere, set Expo app name/slug/scheme and iOS/Android bundle IDs, write `apps/web/.env.local` and `apps/mobile/.env` with the Convex URL, and run `npm install`.

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

- **Web**: `/signup`, `/login`, `/dashboard` (protected). Token in `localStorage`.
- **Mobile**: Same flows; token in `expo-secure-store`.

Auth is implemented in `convex/auth.ts` and shared UI logic in `@project-template/auth` with platform-specific token storage.

## Scripts (root)

| Script | Description |
|--------|-------------|
| `npm run init` | Create new Convex + Vercel project, rename template, write env files (requires `CONVEX_TOKEN`, `VERCEL_TOKEN`) |
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
