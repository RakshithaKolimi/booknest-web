# BookNest Web

Frontend monorepo for BookNest (React + TypeScript + Vite + pnpm + Turbo).

## Workspace Structure

- `apps/web`: main web app (routing, app shell)
- `packages/api`: typed API client/services
- `packages/pages`: page-level UI
- `packages/ui`: shared UI components/icons
- `packages/ui-helpers`: route guards (`PrivateRoute`, `PublicRoute`, `RoleBasedRoute`)
- `packages/utils`: shared auth/currency/storage helpers

## Prerequisites

- Node.js 18+
- pnpm 9+
- BookNest backend running at `http://localhost:8080`

## Environment

1. Copy env:

   ```bash
   cp .env.example .env
   ```

2. Confirm API base URL:

   ```env
   VITE_API_BASE=http://localhost:8080
   ```

## Run (Interview-Safe)

From this folder:

```bash
pnpm install
pnpm dev
```

- App opens at `http://localhost:3000`

## Quality Checks

From this folder:

```bash
pnpm lint
pnpm test
pnpm build
```

## Route + API Expectations

This frontend calls these backend routes:

- Auth: `POST /register`, `POST /login`, `POST /forgot-password`
- Books: `GET /books`, `GET /books/:id`, `POST|PUT|DELETE /books/:id?`
- Cart: `GET /cart`, `POST|PUT /cart/items`, `DELETE /cart/items/:book_id`, `POST /cart/clear`
- Orders: `POST /orders/checkout`, `POST /orders/confirm`, `GET /orders`, `GET /admin/orders`
- Admin catalog: `/authors`, `/categories`, `/publishers`

## Demo Accounts

Use the backend seed/setup data for one `ADMIN` and one `USER` account before interview.
