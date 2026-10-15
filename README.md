# PROPERTY_RENTAL — Rentify

Full-stack property rental platform with role-based dashboards for **Tenants**, **Landlords**, and **Admins**. Tenants browse and search properties, book visits, and submit rent requests. Landlords list and manage properties, handle bookings and rent requests. Admins moderate users and properties while overseeing wallet deposits, withdrawals, escrow, and platform revenue.

**Repo:** https://github.com/Htet-Myat-Lin/PROPERTY_RENTAL.git

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts Reference](#scripts-reference)
- [API Overview](#api-overview)
- [Auth Flow](#auth-flow)
- [Key Domain Flows](#key-domain-flows)
- [Data Model (Prisma)](#data-model-prisma)
- [Notes / Gotchas](#notes--gotchas)

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** (`frontend/`) | React 19, TypeScript, Vite 7, React Router 7, Chakra UI, TanStack React Query, Zustand, React Hook Form + Zod, Axios, Socket.IO client, Leaflet / React-Leaflet (maps), Recharts, FullCalendar, TipTap (rich text) |
| **Backend** (`server/`) | Node.js, Express 5, TypeScript, Prisma 7 (PostgreSQL via `@prisma/adapter-pg`), Socket.IO, BullMQ + Redis (email queue), Nodemailer (Gmail SMTP, OTP mail), JWT (access + refresh, httpOnly cookies), Multer (image uploads), PDFKit |
| **Database / Infra** | PostgreSQL 15 via Docker Compose + Adminer, Redis (required at startup), Prisma multi-file schema (`server/prisma/*.prisma`) |

## Features

**Public**
- Home, property listing with search/filters, property details (map, reviews, images), About, Contact, Testimonials
- Auth: register/login, email verification via OTP, forgot/reset password via OTP

**Tenant** (`/tenant/*`)
- Dashboard, visit bookings, rent requests, real-time chat, notifications, wallet, profile

**Landlord** (`/landlord/*`)
- Dashboard, property CRUD, tenant list, visit booking management, rent request management, calendar, chat, notifications, wallet, profile

**Admin** (`/admin/*`)
- Dashboard, deposit request approval, withdrawal request approval, escrow overview, platform revenue, user management, property moderation

## Architecture

```
┌────────────────────────────┐         ┌─────────────────────────────────┐
│  Browser (React SPA)       │  HTTP   │  Express API + Socket.IO        │
│  localhost:5000            │ ──────► │  localhost:7000                 │
│  React Query / Axios / WS  │ ◄────── │  JWT auth + httpOnly cookies    │
└────────────────────────────┘         └───────┬──────────────┬──────────┘
                                               │              │
                                       ┌───────▼──────┐  ┌────▼─────┐
                                       │ PostgreSQL   │  │ Redis    │
                                       │ :5433 (Prisma)│  │ :6379    │
                                       └──────────────┘  │ BullMQ   │
                                                         │ email Q  │
                                                         └────┬─────┘
                                                              │
                                                         ┌────▼─────┐
                                                         │ Nodemailer│ → SMTP (OTP mails)
                                                         └──────────┘
```

- Frontend and backend run as separate dev servers (**5000** / **7000**); CORS allows `FRONTEND_URL` with credentials.
- Socket.IO shares the Express HTTP server — used for chat and notifications.
- Email jobs (verification / password-reset OTPs) are queued via BullMQ and consumed by a worker started with the app.

## Project Structure

```
PROPERTY_RENTAL/
├── frontend/                   # React + Vite SPA (dev port 5000)
│   ├── src/
│   │   ├── api/                # Axios instance + API services
│   │   ├── app/                # App.tsx, providers, router/, store/ (Zustand)
│   │   ├── components/         # Shared UI components
│   │   ├── features/           # Feature slices (auth, property, booking, chat, wallet, ...)
│   │   ├── layouts/            # DashboardLayout, public layouts
│   │   ├── pages/              # Public pages + dashboards/{admin,landlord,tenant}
│   │   ├── socket/             # Socket.IO client setup
│   │   └── utils/
│   ├── .env                    # VITE_BACKEND_URL, VITE_FILE_URL
│   └── package.json
├── server/                     # Express API (port 7000)
│   ├── src/
│   │   ├── app.ts              # Express app + route mounting
│   │   ├── server.ts           # HTTP + Socket.IO bootstrap
│   │   ├── modules/            # Route / controller / service per domain
│   │   │   ├── auth/  user/  property/  wishlist/  review/
│   │   │   ├── visitbooking/  rentrequest/  wallet/  platform/
│   │   │   ├── dashboard/  admin/  chat/  notification/
│   │   ├── middleware/         # Auth guard, validation, error handler, upload
│   │   ├── lib/                # Prisma client, Redis clients, Socket handler
│   │   ├── queues/ + workers/  # BullMQ email queue/worker
│   │   └── uploads/            # Local image storage (served at /uploads)
│   ├── prisma/
│   │   ├── *.prisma            # Multi-file schema (user, property, chat, payment, wallet, escrow, ...)
│   │   ├── migrations/
│   │   └── seeder/seed.ts      # Seeds ~20 demo properties
│   ├── docker-compose.yml      # postgres:15-alpine (host :5433) + Adminer (:8080)
│   ├── prisma.config.ts        # Datasource + seed command
│   └── .env
└── README.md                   # This file
```

## Getting Started

### Prerequisites

- **Node.js 20+** and npm
- **Docker + Docker Compose** (for PostgreSQL)
- **Redis** on `localhost:6379` — **the backend will not start without it** (`server/src/lib/redis.ts` connects at import time, and BullMQ uses it for the email queue)
- A **Gmail app password** for OTP emails (Nodemailer SMTP)

### 1. Start PostgreSQL and Redis

```powershell
# PostgreSQL + Adminer
cd server
docker compose up -d
```

- PostgreSQL: `localhost:5433` — database `rental_db`, user `postgres`, password `password123`
- Adminer UI: http://localhost:8080 (system: *PostgreSQL*, server: `postgres`, same credentials)

```powershell
# Redis (host port 6379, matches server/src/lib/redis.ts)
docker run -d --name rental_redis -p 6379:6379 redis:7-alpine
```

### 2. Backend setup

```powershell
cd server
npm install
```

`server/.env` (defaults below match the compose file and frontend):

```env
DATABASE_URL="postgresql://postgres:password123@localhost:5433/rental_db?schema=public"
PORT=7000
NODE_ENV=development
FRONTEND_URL=http://localhost:5000
UPLOAD_DIR=src/uploads

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=you@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=rentify.info@gmail.com

REFRESH_TOKEN_SECRET=refresh_secret_key
REFRESH_TOKEN_EXPIRES_IN=7d
ACCESS_TOKEN_SECRET=access_secret_key
ACCESS_TOKEN_EXPIRES_IN=10m
```

Migrate, (optionally seed), and run:

```powershell
npx prisma migrate dev      # create tables from prisma/migrations
npx prisma db seed          # optional: ~20 demo properties (see caveat below)
npm run dev                 # tsx watch src/server.ts
```

- API base: http://localhost:7000/api
- Uploaded images: http://localhost:7000/uploads
- Production: `npm run build` then `npm start` (`tsc` → `node dist/server.js`)

> **Seeding caveat:** `prisma/seeder/seed.ts` attaches all demo properties to a hardcoded landlord ID (`1574e2ff-8cc6-4b27-8439-97e7f5e3f633`). That user must exist first (register a landlord account and update the ID), otherwise seeding fails with a foreign-key error.

### 3. Frontend setup

```powershell
cd frontend
npm install
npm run dev       # Vite on http://localhost:5000 (opens browser automatically)
```

`frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:7000
VITE_FILE_URL=http://localhost:7000/uploads
```

### 4. Open the app

- Frontend: http://localhost:5000
- Register a **Tenant** account (default role) or a **Landlord** account, verify the OTP email, then log in. Admin accounts are provisioned directly in the database (`role = ADMIN`).

## Scripts Reference

**Frontend** (`frontend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (port 5000, auto-opens browser) |
| `npm run build` | Type-check + production build (`tsc -b && vite build`) |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |

**Backend** (`server/`)

| Command | Description |
|---|---|
| `npm run dev` | Dev server with hot reload (`tsx watch src/server.ts`) |
| `npm run build` | Compile TypeScript (`tsc`) |
| `npm start` | Run compiled output (`node dist/server.js`) |
| `npx prisma migrate dev` | Apply/create migrations |
| `npx prisma db seed` | Run `prisma/seeder/seed.ts` |
| `npx prisma studio` | Browse data in Prisma Studio |

## API Overview

Base URL: `http://localhost:7000/api`
Auth: `Authorization: Bearer <accessToken>` on protected routes; refresh token is an httpOnly cookie; CORS allows `FRONTEND_URL` with credentials.

| Prefix | Router | Purpose |
|---|---|---|
| `/api/auth` | `authRouter` | Register, login, logout, refresh, OTP email verification, forgot/reset password |
| `/api/users` | `userRouter` | Profile, user management |
| `/api/properties` | `propertyRouter` | Property CRUD, search/list, details |
| `/api/wishlist` | `wishlistRouter` | Tenant wishlist |
| `/api/reviews` | `reviewRouter` | Property reviews |
| `/api/bookings` | `bookingRouter` | Visit bookings |
| `/api/wallet` | `walletRouter` | Wallet, deposits, withdrawals |
| `/api/rent-requests` | `rentRequestRouter` | Rent request lifecycle |
| `/api/platform` | `platformRouter` | Platform revenue/fees |
| `/api/dashboard` | `dashboardRouter` | Role dashboard stats |
| `/api/admin` | `adminRouter` | Admin: users, properties, deposits, withdrawals, escrow |

**Auth endpoints** (`server/src/modules/auth/auth.route.ts`):

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create account (role defaults to `TENANT`) |
| POST | `/api/auth/login` | Issue access token + refresh cookie |
| POST | `/api/auth/logout` | Clear refresh cookie |
| GET  | `/api/auth/refresh-access-token` | Rotate access token from refresh cookie |
| POST | `/api/auth/send-verify-email-otp` | Send verification OTP |
| POST | `/api/auth/verify-email` | Verify email with OTP |
| POST | `/api/auth/forgot-password` | Start password reset |
| POST | `/api/auth/send-reset-password-otp` | Send reset OTP |
| POST | `/api/auth/reset-password` | Set new password with OTP |

**Real-time:** Socket.IO on the same server (`server/src/lib/socket.ts`) — chat messages and notifications.

## Auth Flow

1. **Register** → OTP emailed (BullMQ → Nodemailer) → **verify email**.
2. **Login** → short-lived access token (`10m`, returned to the client) + httpOnly refresh cookie (`7d`).
3. Client calls `GET /api/auth/refresh-access-token` to rotate the access token; **logout** clears the cookie.
4. **Forgot password** → OTP → reset password.

## Key Domain Flows

- **Visit booking:** tenant books a time slot → landlord confirms/cancels → shows on the landlord calendar (FullCalendar).
- **Rent request:** tenant requests → landlord approves/rejects → property status transitions `AVAILABLE` → `RESERVED` → `RENTED`.
- **Wallet:** tenant requests a deposit → admin approves → balance credited; withdrawals are symmetric; escrow holds funds in transit; platform records fees.

## Data Model (Prisma)

Multi-file schema under `server/prisma/` (client generated to `server/generated/prisma`):

- `User` — roles `TENANT | LANDLORD | ADMIN`, OTP fields, refresh token storage
- `Property` — types `Apartment | House | Condo | Villa`, status `AVAILABLE | RENTED | RESERVED`, coordinates for Leaflet maps
- `VisitBooking`, `RentRequest`, `DepositRequest`, `WithdrawalRequest`
- `Wallet` / `WalletTransaction`, `Payment`, `Escrow`
- `Chat` / `Message` / `ChatRead`, `Notification`
- `Wishlist`, `Review`

## Notes / Gotchas

- **Redis is mandatory at startup** — `server/src/lib/redis.ts` connects at import time (top-level `await`), so the API crashes immediately if Redis on `localhost:6379` is down.
- `server/.env` and `frontend/.env` are committed with dev secrets — rotate them and use a secrets manager before any public deploy.
- Uploads are stored on local disk (`server/src/uploads`, served via `/uploads`). Use object storage (S3/etc.) for production.
- `ACCESS_TOKEN_EXPIRES_IN=10m` is short — the frontend Axios interceptor must refresh proactively on 401/expiry.
- Docker Compose exposes Postgres on host port **5433** (not the default 5432).
- Frontend dev port is **5000** (Vite default overridden in `vite.config.ts`); backend is **7000**. Keep `FRONTEND_URL`, `VITE_BACKEND_URL`, and `VITE_FILE_URL` in sync.
- `frontend/README.md` is the stock Vite template — this root README is the canonical project documentation.
