# Leave Management Frontend

A React + TypeScript single-page app for requesting, approving, and tracking
employee leave: applying for leave, viewing leave balances, approving a
team's pending requests, managing public holidays, assigning user roles, and
a team calendar / notifications view.

It is the frontend half of a two-repo system. The backend is
[`leave-management-api`](https://github.com/YannVladimir/leave-management-api),
a Spring Boot REST API (Java 21, PostgreSQL, Microsoft OAuth2 + JWT). This
app is a plain client of that API over HTTP/JSON — it holds no business logic
of its own beyond form validation and presentation.

## Tech stack

- React 19 + TypeScript
- Vite (build tool / dev server)
- React Router (client-side routing)
- Tailwind CSS (styling)
- Heroicons (icons)
- Vitest + React Testing Library (tests)
- ESLint

## Project structure

```
src/
├── components/     # Shared UI (Layout, Header, Sidebar, AsyncState, ...)
├── hooks/          # useAsync - data fetching with loading/error state
├── pages/          # One component per route (Dashboard, ApplyLeave, ...)
├── services/       # api.ts - fetch wrapper around the backend REST API
├── types/          # Shared TypeScript types mirroring the API's DTOs
└── utils/          # Pure helpers (e.g. form validation), easy to unit test
```

## Prerequisites

- Node.js 20+ and npm
- A running instance of `leave-management-api` (see that repo's README for
  how to start it - by default it listens on `http://localhost:8083`)

## Getting started

```bash
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if your API isn't on localhost:8083
npm run dev
```

The app will be available at the URL Vite prints (typically
`http://localhost:5173`).

## Environment variables

| Variable              | Description                                              | Default                        |
| ---------------------- | --------------------------------------------------------- | ------------------------------- |
| `VITE_API_BASE_URL`   | Base URL of the `leave-management-api` backend, including the `/api` prefix | `http://localhost:8083/api` |

See `.env.example`. Vite only exposes variables prefixed with `VITE_` to
client code, and `.env*` files (other than `.env.example`) are git-ignored so
local/deployment-specific URLs never get committed.

## Available scripts

| Command           | Description                                      |
| ------------------ | -------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with hot reload          |
| `npm run build`   | Type-check (`tsc -b`) and build for production     |
| `npm run preview` | Preview the production build locally              |
| `npm run lint`    | Run ESLint                                          |
| `npm test`        | Run the Vitest test suite once                      |
| `npm run test:watch` | Run Vitest in watch mode                        |

## Testing

Tests use Vitest + React Testing Library and live next to the code they
cover (`*.test.ts` / `*.test.tsx`). They cover:

- Leave request form validation rules (`src/utils/validateLeaveRequest.test.ts`)
- The API client's error handling, including network failures
  (`src/services/api.test.ts`)
- The Apply Leave form's success/validation/error UI states
  (`src/pages/ApplyLeave.test.tsx`)
- Sidebar navigation and active-route highlighting
  (`src/components/Layout/Sidebar.test.tsx`)

Run them with:

```bash
npm test
```

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request to `main`: it
installs dependencies, lints, runs the test suite, and builds the app, so a
broken build or failing test is caught before merge.

## Notes on the backend contract

Page-level API calls currently used:

- `GET /leave/balance/my-balances`, `GET /leave-requests/my-requests` - Dashboard
- `POST /leave-requests` - Apply Leave
- `GET /leave-requests/team`, `PUT /leave-requests/{id}/approve|reject` - Leave Approval
- `GET /leave/balance/my-balances` - Leave Balance
- `GET /holidays`, `POST /holidays`, `GET /holidays/between` - Admin Panel / Team Calendar
- `GET /users/roles`, `PUT /users/{userId}/roles` - User Roles

The Notifications page currently uses local sample data, since the backend
does not yet expose a REST endpoint for notifications (only an internal
email-sending service). Once one exists, swap the sample data for an
`api.get()` call the same way the other pages do.
