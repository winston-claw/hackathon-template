# Hackathon Template

A production-ready hackathon starter template with Next.js 14, Expo (React Native), Convex (auth + database), and Tailwind CSS. Web and mobile share the same Convex backend and auth logic.

## Features

- **Next.js 14** - App Router, TypeScript, Server Components
- **Expo 54** - React Native app with Expo Router (iOS, Android, web); React 19, RN 0.81
- **Convex** - Real-time database + auth (signup, login, sessions)
- **Shared auth** - `@project-template/auth` with platform adapters (localStorage / SecureStore)
- **Tailwind CSS** - Utility-first styling (web)
- **Vercel** - Production-ready deployment (web)

## Quick Start

```bash
# Clone the repo
git clone https://github.com/winston-claw/project-template.git
cd project-template

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
