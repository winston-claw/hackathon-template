# App Template

A production-ready universal app template with Next.js 15, Expo (React Native), Convex (auth + database), and Gluestack UI v3 (NativeWind). Web and mobile share the same Convex backend, auth logic, screens, and design system.

**Repository:** [github.com/winston-claw/hackathon-template](https://github.com/winston-claw/hackathon-template)

## Features

- **Next.js 15** — App Router, TypeScript, react-native-web for shared screens
- **Expo 54** — React Native app with Expo Router (iOS, Android); dev builds via `expo-dev-client` (not Expo Go)
- **Convex** — Real-time database + auth (signup, login, sessions, Google/Apple OAuth)
- **Gluestack UI v3** — Universal component library in `@app-template/ui` (NativeWind/Tailwind)
- **Shared packages** — `@app-template/ui` (design system) and `@app-template/app` (screens, auth, db)
- **Turborepo** — Cached builds and parallel dev tasks
- **Example feature** — `/tasks` route demonstrating AuthGuard + Convex CRUD
- **Vercel + EAS** — Web deploy config and mobile build profiles

## Starting a new project

### Prerequisites

- **Node.js 20+** and **npm 10+**
- **Xcode** (macOS, for iOS) or **Android Studio** (for Android) — for local mobile dev builds
- Accounts: [Convex](https://convex.dev), [Vercel](https://vercel.com) (for automated setup), [Expo](https://expo.dev) (optional, for EAS cloud builds)

### 1. Clone the template

```bash
git clone https://github.com/winston-claw/hackathon-template.git my-app
cd my-app
npm install
```

To start with a clean git history:

```bash
rm -rf .git && git init && git add . && git commit -m "Initial commit from app template"
```

### 2. Bootstrap (recommended)

The init script renames the project, creates Convex + Vercel projects, writes env files, and deploys.

Get tokens from [Convex](https://dashboard.convex.dev) (Settings → Deploy Keys) and [Vercel](https://vercel.com/account/tokens), then:

```bash
export CONVEX_TOKEN="your-convex-token"
export VERCEL_TOKEN="your-vercel-token"
npm run init
```

You'll be prompted for a display name and bundle ID prefix (e.g. `com.mycompany`).

After init, set your Apple Team ID in `apps/mobile/app.json` if building for iOS:

```json
"ios": {
  "appleTeamId": "YOUR_TEAM_ID"
}
```

Add Google/Apple OAuth later with:

```bash
npm run auth
```

### Manual setup (alternative)

If you prefer to set things up yourself:

```bash
npm run convex:dev   # log in, create a Convex project, copy the deployment URL

cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
# Set NEXT_PUBLIC_CONVEX_URL and EXPO_PUBLIC_CONVEX_URL to the same Convex URL
```

### 3. Build the mobile dev client (one-time)

Mobile uses **development builds** (`expo-dev-client`), not Expo Go.

```bash
cd apps/mobile
npx expo run:ios        # iOS simulator (requires Xcode)
# or: npx expo run:android
# or: npx eas build --profile development --platform ios
cd ../..
```

Rebuild when you add or change native dependencies.

### 4. Run locally

```bash
npm run dev:all        # Convex + web + mobile

# Or individually:
npm run convex:dev
npm run dev:web        # http://localhost:3000
npm run dev:mobile     # Metro — open the dev client app on your device/simulator
```

### 5. Verify

1. Sign up at `/signup`, log in, visit `/dashboard`
2. Try `/tasks` — add, complete, and delete a task
3. Repeat on mobile via the dev client

## Quick Start

```bash
git clone https://github.com/winston-claw/hackathon-template.git my-app
cd my-app
npm install
npm run init   # or manual setup — see above
```

## Project Structure

```
app-template/
├── apps/
│   ├── web/                 # Next.js — thin routes + platform wiring
│   └── mobile/              # Expo — thin routes + platform wiring
├── packages/
│   ├── ui/                  # Gluestack v3 + NativeWind design system
│   └── app/                 # Screens, AuthGuard, auth, Convex client
├── convex/                  # Convex backend (schema, auth, tasks)
├── turbo.json               # Turborepo task config
├── AGENTS.md                # Agent instructions
└── package.json             # Workspaces + root scripts
```

## Mobile development

This template uses **development builds** (`expo-dev-client`), not Expo Go. OAuth (Google/Apple) and native modules require your app's bundle identifier.

**First time setup** (from `apps/mobile`):

```bash
# Local build (requires Xcode or Android Studio)
npx expo run:ios        # iOS simulator
npx expo run:android    # Android emulator/device

# Or cloud build via EAS (works without local native tooling)
npx eas build --profile development --platform ios
```

Then from repo root, `npm run dev:mobile` starts Metro. Open the dev client app on your device/simulator — it connects automatically.

Rebuild the dev client when you add or change native dependencies.

Add app icons and splash images in `apps/mobile/app.json` when you're ready to ship (see [Expo app config](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/)).

## Authentication

- **Web:** `/signup`, `/login`, `/dashboard`, `/tasks` (protected via `AuthGuard`)
- **Mobile:** Same flows; token in `expo-secure-store`
- Auth backend: `convex/auth.ts`; client: `packages/app/src/auth/`

## Example: Tasks feature

After logging in, visit `/tasks` to add, complete, and delete tasks. Backend: `convex/tasks.ts`. Screen: `packages/app/src/screens/tasks-screen.tsx`.

## Scripts (root)

| Script | Description |
|--------|-------------|
| `npm run dev:all` | Convex + web + mobile in parallel |
| `npm run dev` / `dev:web` | Next.js dev server |
| `npm run dev:mobile` | Metro dev server (requires dev client app) |
| `npm run build:mobile:dev` | EAS development build (iOS/Android) |
| `npm run convex:dev` | Convex dev + codegen |
| `npm run build:web` | Production web build |
| `npm run typecheck` | Turborepo typecheck |
| `npm run init` | New project setup (Convex + Vercel) |
| `npm run auth` | Add Google + Apple OAuth |
| `npm run deploy` | Deploy Convex + Vercel only |

## Environment Variables

See `apps/web/.env.example` and `apps/mobile/.env.example`. Both apps must use the **same** Convex deployment URL.

## Deployment

### Web (Vercel)

Import the repo with **Root Directory** at repo root. Set `NEXT_PUBLIC_CONVEX_URL`. Root `vercel.json` builds from `apps/web`.

### Mobile (EAS)

`apps/mobile/eas.json` includes development, preview, and production profiles. Set `EXPO_PUBLIC_CONVEX_URL` via EAS environment variables.

Build a development client before first mobile run:

```bash
cd apps/mobile && npx eas build --profile development --platform ios
```

Or build locally: `npx expo run:ios` / `npx expo run:android`.

### Convex

```bash
npm run convex:deploy
```

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [Expo 54](https://expo.dev/)
- [Convex](https://convex.dev/)
- [Gluestack UI v3](https://gluestack.io/ui)
- [NativeWind](https://www.nativewind.dev/)
- [Turborepo](https://turbo.build/)
- [TypeScript](https://www.typescriptlang.org/)

## License

MIT — see [LICENSE](LICENSE).
