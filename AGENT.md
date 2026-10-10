# AGENT.md

## Project overview
This repository is a full-stack property rental platform with three primary user roles: tenant, landlord, and admin. The application is split into two main parts:

- `frontend/`: Vite + React + TypeScript single-page app
- `server/`: Express + TypeScript API with Prisma, PostgreSQL, Redis, BullMQ, and Socket.IO

The project supports property discovery, listings, bookings, rent requests, wallet/escrow flows, chat, notifications, and admin platform management.

## Repository structure

```text
PROPERTY_RENTAL/
├── frontend/
│   ├── src/
│   │   ├── app/                  # app bootstrap, providers, router, store
│   │   ├── components/           # shared UI sections and presentational widgets
│   │   ├── features/             # feature-based domains (auth, property, wallet, booking, rentrequest, chat, notification)
│   │   ├── pages/                # route-level screens
│   │   ├── layouts/              # dashboard layouts and shell components
│   │   ├── api/                  # Axios clients and service modules
│   │   ├── hooks/                # shared hooks (if present)
│   │   ├── utils/                # helpers such as formatting and geocoding
│   │   └── ...
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig*.json
│   └── README.md
├── server/
│   ├── prisma/                  # Prisma schema and migrations configuration
│   ├── generated/prisma/        # generated Prisma client output
│   ├── src/
│   │   ├── app.ts               # Express app setup
│   │   ├── server.ts            # server bootstrapping
│   │   ├── modules/             # domain modules (auth, property, wallet, rentrequest, review, user, chat)
│   │   ├── repositories/        # data access layer and persistence logic
│   │   ├── middleware/          # auth, validation, upload, error handling
│   │   ├── utils/               # helpers (JWT, email, payments, lease PDF generation)
│   │   ├── lib/                 # Prisma/Redis/Socket singletons
│   │   ├── queues/              # BullMQ email queue
│   │   ├── workers/             # background job workers
│   │   └── types/
│   ├── package.json
│   ├── prisma.config.js
│   └── tsconfig.json
├── .gitignore
├── AGENT.md
├── SKILL.md
└── ...
```

## Frontend architecture
The frontend is organized by feature domains instead of a single giant page tree. Common patterns:

- `features/*/hooks`: React Query hooks for API access
- `features/*/components`: domain-specific UI components
- `features/*/store`: Zustand slices for local state
- `features/*/schema`: Zod validation schemas for forms
- `features/*/types`: domain typing
- `app/router/index.tsx`: all public and role-based routes
- `app/providers`: theme and socket providers

Route access is segmented by role using `ProtectedRoute` and has dedicated admin, landlord, and tenant dashboards.

## Backend architecture
The server follows a modular layered pattern:

- `src/modules/*`: controllers, routes, validation, business logic
- `src/repositories/*`: persistence access to Prisma data and custom query logic
- `src/middleware/*`: request validation, auth guard, upload handling, error middleware
- `src/utils/*`: email, JWT, lease generation, validation helpers
- `src/lib/*`: Prisma/Redis/Socket adapters
- `src/queues/*` and `src/workers/*`: async job processing

Most request flows look like this:

1. Route receives request
2. Validation middleware checks body/query params
3. Controller delegates to service
4. Service uses repository methods and Prisma
5. Response is normalized through shared API helpers

## Runtime and tooling

### Frontend
- Framework: React + Vite
- UI: Chakra UI + custom components
- State/data: React Query, Zustand
- Mapping: Leaflet + React Leaflet
- Auth and socket integration: custom hooks and providers

### Backend
- Framework: Express
- DB: PostgreSQL via Prisma
- Cache/queue: Redis + BullMQ
- Real-time: Socket.IO
- Auth: JWT + cookies
- Validation: Zod

## Common commands

From `frontend/`:

```bash
npm install
npm run dev
npm run build
npm run lint
```

From `server/`:

```bash
npm install
npm run dev
npm run build
```

## Working conventions
- Keep feature work aligned to the existing domain folders instead of creating a new cross-cutting structure unless necessary.
- Prefer the existing layered pattern: route -> validation -> service -> repository -> Prisma.
- Use typed interfaces and Zod schemas when adding new API payloads or UI forms.
- Match existing naming conventions (`useX`, `FeatureName`, `*-service.ts`, `*-route.ts`, `*-controller.ts`).
- For new API consumers on the frontend, keep logic in `features/<domain>/hooks` and share common utilities in `utils/`.
- Keep backend env configuration in `.env` files; do not hardcode secrets or connection strings.

## Domain areas to be aware of
- `auth`: login, registration, password reset, email verification
- `property`: property listing, search, recommendations, reviews, wishlist
- `booking`: landlord/tenant visit booking workflow
- `rentrequest`: rent applications and escrow approval logic
- `wallet`: deposits, withdrawals, transaction tracking
- `chat`: real-time messaging and presence
- `notification`: user notifications
- `platform`: admin platform stats and management

## Contribution guidance
When making code changes:

1. Identify the correct feature folder before editing.
2. Try to follow the existing service/repository separation.
3. Preserve type safety and validation rules.
4. Update affected frontend hooks/UI and backend route/service logic together when a feature crosses both tiers.
5. Prefer small, surgical changes that match the currently established patterns.

## Notes for AI agents
- The repository is a monorepo-like full-stack app, not a single serverless service.
- Frontend and backend are independent Node projects with separate package manifests and lockfiles.
- Always validate the relevant tier when changing code; do not assume a frontend-only or backend-only patch is sufficient.
- If a task impacts Prisma models or generated client logic, keep schema and usage consistent with the existing domain modules.
