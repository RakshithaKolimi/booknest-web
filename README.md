# BookNest Web

Frontend monorepo for the BookNest bookstore. The workspace uses React, TypeScript, Vite, pnpm workspaces, and Turbo, with shared packages for API access, page composition, UI, route guards, and browser utilities.

## What is in this repo

- `apps/web`: the browser app and route shell
- `packages/api`: Axios client and typed service wrappers
- `packages/pages`: page-level screens for auth, catalog, cart, profile, and admin flows
- `packages/ui`: shared UI components
- `packages/ui-helpers`: route guards such as `PrivateRoute`, `PublicRoute`, and role-based access
- `packages/utils`: auth/session and client-side helpers

## Prerequisites

- Node.js `18+`
- pnpm `9+`
- BookNest Platform running locally on `http://localhost:8080`

## Environment

Create a `.env` file in this directory. The frontend reads `VITE_API_BASE` and automatically appends `/api/v1` if you provide only the backend origin.

```env
VITE_API_BASE=http://localhost:8080
```

Examples:

- `http://localhost:8080` becomes `http://localhost:8080/api/v1`
- `http://localhost:8080/api/v1` is used as-is

## Install and run

From this directory:

```bash
pnpm install
pnpm dev
```

`pnpm dev` runs the monorepo dev pipeline through Turbo. That includes the Vite app plus the workspace packages that are watched with `tsup`.

Default local URLs:

- App: `http://localhost:3000`
- Compatible backend origins: `http://localhost:8080`

## Available scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm format
```

App-specific commands are also available from `apps/web`:

```bash
pnpm --filter @booknest/web dev
pnpm --filter @booknest/web build
pnpm --filter @booknest/web test
```

## Application behavior

The app currently includes:

- Public auth pages for login, registration, forgot password, reset password, and reset success
- Protected user routes for home, books, book detail, cart, orders, and profile
- Admin-only routes for catalog management and admin order views
- Token refresh support through `/auth/refresh`, with a legacy fallback to `/refresh`

Authentication state is stored client-side and attached to API requests through the shared Axios client in `packages/api`.

## Backend contract

This app expects the backend API under `/api/v1` with these route groups:

- Auth: `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/reset-password/confirm`
- Books: `/books`, `/book/:id`
- Cart: `/cart`, `/cart/items`, `/cart/items/:book_id`, `/cart/clear`
- Orders: `/orders`, `/orders/checkout`, `/orders/confirm`, `/admin/orders`
- Catalog: `/authors`, `/categories`, `/publishers`

If the platform server is not running or CORS is not configured for the frontend origin, login and data-loading flows will fail immediately.

## Workspace notes

- The workspace is declared in [`pnpm-workspace.yaml`](./pnpm-workspace.yaml)
- Root scripts use Turbo to coordinate package builds and tests
- Shared packages such as `@booknest/pages`, `@booknest/ui`, `@booknest/ui-helpers`, and `@booknest/utils` build through `tsup`

## Recommended local workflow

1. Start the platform backend first.
2. Confirm `VITE_API_BASE` points at that backend.
3. Run `pnpm dev` from this repository.
4. Sign in with a seeded or manually created user.
5. Use an admin account as well if you want to verify `/admin/manage` and `/admin/orders`.
