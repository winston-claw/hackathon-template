# Agent Instructions

Cross-platform monorepo: Next.js (web) + Expo (mobile) sharing Convex backend, auth, and UI via workspace packages.

## Architecture

```
hackathon-template/
├── apps/
│   ├── web/          # Next.js 15 App Router — thin routes + platform wiring only
│   └── mobile/       # Expo Router — thin routes + platform wiring only
├── packages/
│   ├── ui/           # Design system (presentational components + theme tokens)
│   └── app/          # Product code: screens, auth, Convex client
└── convex/           # Canonical Convex backend (schema, mutations, auth)
```

## Package boundaries

### `@project-template/ui` — design system only

- **Contains:** theme tokens (`colors`, `radius`), reusable RN components (`Button`, `Input`, `AuthScreen`, etc.)
- **Must NOT contain:** screens, auth, Convex, Solito, business logic, or API calls
- **Styling:** React Native `StyleSheet` + shared theme tokens. No Tailwind in this package.
- **Exports:** add new components to `packages/ui/index.ts`

### `@project-template/app` — product layer

- **Contains:**
  - `src/screens/` — full screen components (login, signup, dashboard, home)
  - `src/auth/` — `createAuthProvider`, `useAuth`, token adapters (localStorage / SecureStore)
  - `src/db/` — `createConvexClient`, re-export of `api` from `convex/_generated`
- **May depend on:** `@project-template/ui`, `solito`, `convex`, `react-native`
- **Screens must:** compose `@project-template/ui` components; use `useAuth` from `../auth`; use Solito for navigation (`Link`, `useRouter`, `TextLink`)
- **Exports:** add screens to `packages/app/index.ts`

### `apps/web` and `apps/mobile` — platform shells

- **Routes are thin re-exports.** Do not put screen UI or business logic here.
- **Platform-only code stays in apps:**
  - Web: OAuth redirect pages (`/auth/google`, `/auth/apple`), API routes, `providers.tsx`, `lib/auth.tsx` (token store wiring)
  - Mobile: `app/auth/callback.tsx`, `_layout.tsx`, `lib/auth.tsx` (SecureStore wiring)
- **Web shared screens:** `'use client'` required on pages that re-export from `@project-template/app` (they use React Native via `react-native-web`)

## Adding a new feature

### New UI primitive (button variant, card, etc.)

1. Create `packages/ui/src/components/my-component.tsx`
2. Export from `packages/ui/index.ts`
3. Use theme tokens from `packages/ui/src/theme/` — do not hardcode colors

### New screen

1. Create `packages/app/src/screens/my-screen.tsx`
2. Compose `@project-template/ui` components
3. Export from `packages/app/index.ts`
4. Add thin route:
   - Web: `apps/web/app/my-route/page.tsx` → `export { MyScreen as default } from '@project-template/app'`
   - Mobile: `apps/mobile/app/my-route.tsx` → same re-export (no `'use client'` needed unless you add local logic)

### New Convex function

1. Add to `convex/` at repo root (not inside apps)
2. Run `npm run convex:dev` to regenerate types
3. Import via `@project-template/app/db/api` or `@project-template/app`

### New auth behavior

1. Update `convex/auth.ts` for backend
2. Update `packages/app/src/auth/createAuth.tsx` if client context changes
3. Keep token storage adapters in `packages/app/src/auth/adapters/`

## Tech stack

- **Web:** Next.js 15, react-native-web, Solito, Convex
- **Mobile:** Expo 54, Expo Router, React Native 0.81, React 19
- **Backend:** Convex (`convex/` at repo root)
- **Monorepo:** npm workspaces (`apps/*`, `packages/*`)

## Commands (run from repo root)

| Command | Purpose |
|---------|---------|
| `npm run dev` / `dev:web` | Next.js dev server |
| `npm run dev:mobile` | Expo dev server |
| `npm run convex:dev` | Convex dev + codegen |
| `npm run build:web` | Production web build |
| `npm run typecheck` | Typecheck workspaces |
| `npm run init` | New project setup (Convex + Vercel) |

## Environment variables

- Web: `NEXT_PUBLIC_CONVEX_URL` in `apps/web/.env.local`
- Mobile: `EXPO_PUBLIC_CONVEX_URL` in `apps/mobile/.env`
- Use the **same** Convex deployment URL for both apps

## Do not

- Put screen UI in `apps/web` or `apps/mobile` — use `packages/app`
- Put business logic or Convex hooks in `packages/ui`
- Create separate `auth` or `db` packages (consolidated in `@project-template/app`)
- Use DOM-only components (`div`, Tailwind) in shared screens — use RN primitives for cross-platform
- Commit unless explicitly asked
- Edit generated files in `convex/_generated/`
