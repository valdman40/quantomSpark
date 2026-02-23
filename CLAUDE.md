# Quantum Spark UI — Developer Guide

## Project
A React demo/mockup of the Check Point Quantum Spark gateway admin UI.
By default all data is served via MSW in-browser mock API (`/api/*`).
Set `VITE_USE_REAL_API=true` in `.env.local` to call the real gateway (see **Gateway API** section).

## Running
```bash
npm run dev        # http://localhost:3000 (or 3001)
npx tsc --noEmit   # type-check without building
```

---

## Tech Stack

| Tool | Version | Role |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5.7 | Type safety |
| Vite | 6 | Dev server + build |
| React Router v6 | 6.28 | Nested URL routing |
| Redux Toolkit v2 | 2.3 | State management |
| redux-saga | 1.3 | Side effects / async |
| TanStack React Query v5 | 5.62 | Data fetching + caching |
| react-hook-form | 7.54 | Forms |
| MSW v2 | 2.7 | Mock service worker (API) |
| @dnd-kit | 6/10 | Drag-and-drop (rule reorder) |
| lucide-react | latest | Icon library |

---

## Core Architecture Rules

| Concern | Solution |
|---|---|
| GET requests | **React Query** (`useQuery`) |
| POST/PUT/DELETE | **Redux Sagas** (`call([apiClient, 'post'], ...)`) |
| UI-only state | **Redux Slices** (modals, loading flags, filters) |
| Cache refresh after write | Sagas call `queryClient.invalidateQueries()` |

> **Never** call `apiClient.post/put/delete` directly from a component.
> Dispatch a saga action and let the saga handle it.

---

## Adding a New Page

1. **navConfig** — add a leaf to `src/router/navConfig.ts` with a `path`
2. **Feature folder** — create `src/features/<section>/<feature>/`
   - `<Feature>.tsx` — page component
   - `hooks/use<Feature>.ts` — React Query hook (for reads)
   - `<feature>Slice.ts` — Redux slice (UI state only)
   - `<feature>Saga.ts` — saga (writes)
   - `components/` — sub-components
3. **Wire Redux** — add reducer to `src/app/store.ts` + saga to `src/app/rootSaga.ts`
4. **Router** — add to `COMPONENT_MAP` in `src/router/index.tsx`
5. **Mock data** — add to `src/mocks/data/<section>.ts`
6. **MSW handler** — add to `src/mocks/handlers/<section>.ts`

---

## Key File Locations

```
src/
├── app/
│   ├── store.ts            # Redux store + all reducers
│   ├── rootSaga.ts         # Forks all feature sagas
│   ├── queryClient.ts      # React Query client (30s stale time)
│   └── uiSlice.ts          # Global UI state (sidebar, notifications)
├── assets/
│   └── CheckPointLogo.tsx  # Inline SVG Check Point logo component
├── components/layout/
│   ├── AppShell.tsx        # Root layout (TopBar + Sidebar + content + StatusBar + Footer)
│   ├── TopBar.tsx          # Top navigation bar
│   ├── Sidebar.tsx         # Left nav (light theme, search filter, lucide icons)
│   ├── StatusBar.tsx       # Bottom status bar (connectivity, uptime, time)
│   └── Footer.tsx          # Minimal enterprise footer
├── mocks/
│   ├── data/               # In-memory mock data arrays
│   └── handlers/index.ts   # All MSW handlers combined
├── router/
│   ├── navConfig.ts        # Single source of truth for ALL nav items
│   └── index.tsx           # createBrowserRouter + COMPONENT_MAP
├── services/
│   ├── api/
│   │   ├── client.ts       # Axios instance (baseURL /api)
│   │   └── endpoints.ts    # All API paths (single source of truth)
│   └── queryKeys.ts        # All React Query key factories
├── styles/
│   └── global.css          # All CSS (no CSS modules, no styled-components)
└── types/
    └── home.ts             # Shared types for home section
```

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Component files | PascalCase | `BladeCard.tsx` |
| Hook files | camelCase `use` prefix | `useBladeCategories.ts` |
| CSS classes | kebab-case | `.blade-card`, `.system-panel-hdr` |
| Saga action strings | `<slice>/<action>` | `securityDashboard/toggleBlade` |
| Query keys | factory function, `as const` | `() => ['home', 'blade-categories'] as const` |
| Redux slice names | camelCase | `securityDashboard` |

---

## CSS Guide

- **Single file**: all CSS lives in `src/styles/global.css` — no CSS modules, no styled-components
- **Icons**: use `lucide-react` (imported as named exports) — do NOT create manual SVG icons
- **Design tokens**: use CSS vars (`var(--brand)`, `var(--border)`, etc.) defined in `:root`
- **Responsive**: media queries in global.css — mobile breakpoint 768px, tablet 1024px
- **No inline styles** for layout — add CSS classes instead (except one-off tweaks like `style={{ marginTop: 4 }}`)

---

## Mock Data & MSW

- MSW intercepts all `/api/*` requests in the browser (service worker in `public/`)
- Handlers live in `src/mocks/handlers/` — one file per feature section
- Mock data lives in `src/mocks/data/` — exported `let` arrays that handlers mutate in-place
- **Do NOT reassign** imported `let` arrays — mutate them in-place:
  ```ts
  // WRONG: mockItems = [...mockItems, newItem]
  // RIGHT: mockItems.push(newItem)
  ```

## Adding a new endpoint

1. Add path to `src/services/api/endpoints.ts`
2. Add query key factory to `src/services/queryKeys.ts` (always end with `as const`)
3. Add mock data to `src/mocks/data/<section>.ts`
4. Add MSW handler to `src/mocks/handlers/<section>.ts`
5. Create React Query hook in `src/features/<section>/hooks/`

---

## Gateway API

The real gateway exposes a JSON-RPC–style endpoint. Currently wired for firewall rules only.

### Request format
```
POST https://{ip}:4434/platform.cgi?mvc=true&token={url_token}&currentPage={page}&op={op}
Headers: Content-Type: application/json, X-Requested-With: XMLHttpRequest
         Cookie: cpa=admin; UTM1Login={session_token}   ← injected by Vite proxy
Body:    {"action":"fwRuleView","method":"read","data":[{...}],"type":"rpc","tid":N}
```

### Response envelope
```json
{ "type":"rpc","tid":1,"result":{"totalCount":N,"success":true,"data":[...],"messages":{"fullMessages":[]}} }
```

### Toggle mock ↔ real data
Set these in `.env.local` (never commit) then restart the dev server:
```
VITE_USE_REAL_API=true          # false = MSW mock (default)
VITE_GATEWAY_IP=172.28.x.x
VITE_GATEWAY_PORT=4434
VITE_GATEWAY_TOKEN=<url token>
VITE_GATEWAY_COOKIE=cpa=admin; UTM1Login=<session token>
```
See `.env.example` for the full list with instructions.

### Key files
- `src/config.ts` — `USE_REAL_API`, `GATEWAY_TOKEN` flags
- `src/types/gateway.ts` — `GatewayFwRule`, `GatewayNetworkObject`, `GatewayRpcResponse`, etc.
- `src/services/api/gatewayClient.ts` — `gatewayClient.fetchFirewallRules()`
- `src/services/api/normalizers/firewallNormalizer.ts` — maps gateway data → `FirewallRule`
- `vite.config.ts` — Vite proxy (`/gateway/*` → `https://{ip}:4434`, `secure:false`)

### Adding a new gateway endpoint
1. Add a method to `gatewayClient.ts` calling the `rpcCall()` helper with the right `op` and `currentPage`.
2. Add the gateway response type to `src/types/gateway.ts`.
3. Create a normalizer in `src/services/api/normalizers/` that maps it to the existing app type.
4. Branch on `USE_REAL_API` in the relevant React Query hook (same pattern as `useFirewallRules`).

### Gateway field conventions
- Fields with no value arrive as `[]` (empty array), not `null` / `undefined`.
- `action` strings: `ACTION.ACCEPT` | `ACTION.BLOCK` | `ACTION.REJECT` | `ACTION.LAYER`
- `log` strings: `LOG_LEVEL.LOG` | `LOG_LEVEL.NONE` | `LOG_LEVEL.ALERT`
- `sources` / `destinations` / `appsAndServices` arrays — empty = "Any"
- `sectionIdx` + `idx` together define rule ordering (idx can be fractional, e.g. 0.125)

---

## Reference Screenshots

Put screenshots in `images_for_instructions/` with descriptive filenames like
`home_overview_system.jpg`. Read them using the Read tool during planning.
Use images as structural reference — not pixel-perfect targets.

---

## Common Pitfalls

1. **Don't reassign imported mock arrays** — mutate in-place (MSW shares the reference)
2. **Always `as const`** on query key arrays — prevents TypeScript widening
3. **Always invalidate queries after writes** — sagas call `queryClient.invalidateQueries()`
4. **Saga action strings are not type-safe** — use the exact string from the saga `takeLatest()`
5. **React Query = reads only** — writes go through sagas, never direct from components
6. **Mobile sidebar** — use `toggleMobileSidebar` action (not `toggleSidebar`) on `window.innerWidth <= 768`
