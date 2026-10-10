# SKILL.md

## Skill: Full-stack property rental platform development

This repository contains a property rental application with role-based dashboards for tenants, landlords, and admins. The working skill is to modify the software without breaking the separation between frontend UI, API logic, and persistence.

## Core responsibilities

### Frontend work
- Build and update pages under `frontend/src/pages/`
- Add or refine components under `frontend/src/components/` and feature folders
- Keep API access in `frontend/src/features/*/hooks` and `frontend/src/api/services/*`
- Use existing Zod schemas and form patterns for validation-heavy workflows
- Respect route guards and role access conditions in `frontend/src/app/router/`

### Backend work
- Add or edit endpoints under `server/src/modules/*`
- Keep business logic in service files and persistence in repository files
- Use validation middleware and Zod schemas before processing requests
- Keep Prisma usage centralized and consistent with the schema in `server/prisma/schema.prisma`
- Use Redis, queues, and worker patterns only where the app already does so

## Project patterns to match

### Frontend conventions
- Feature-first organization by domain (`auth`, `property`, `wallet`, `booking`, `chat`, etc.)
- React Query hooks for API fetching and mutations
- Zustand slices for local store state
- Chakra UI and custom shared components for styling
- Return-to-route/responsive patterns using the existing page layout system

### Backend conventions
- Express route modules register endpoints by domain
- Controllers delegate to services, not direct business logic
- Services talk to repositories, not raw Prisma calls scattered across the project
- Middleware handles validation and errors consistently
- JWT/cookie auth and upload handling are already in place and should be respected

## Typical implementation flow
1. Find the feature domain and its route/controller/service files.
2. Read the related type/schema and the matching frontend hook or API service.
3. Make the minimal cross-tier change needed.
4. Keep naming and folder placement consistent with the existing structure.
5. Validate the relevant command(s) for the changed tier.

## Common tasks

### Add a new property-related API flow
- backend: `server/src/modules/property/...`
- repository: `server/src/repositories/property.repository.ts`
- frontend: `frontend/src/features/property/...`

### Add a new wallet or escrow workflow
- backend: `server/src/modules/wallet/...`
- repository: `server/src/repositories/wallet.repository.ts` and related request repos
- frontend: `frontend/src/features/wallet/...`

### Add dashboard or page access for a role
- update `frontend/src/app/router/index.tsx`
- ensure the page sits in the correct dashboard layout and role guard

### Add or change validation
- update the Zod schema in the relevant feature folder
- ensure both frontend and backend models remain aligned

## Suggested commands

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
```

Backend:

```bash
cd server
npm install
npm run dev
npm run build
```

## Safety and quality expectations
- Do not bypass existing middleware or role protections.
- Preserve type safety and API contract consistency.
- Avoid duplicating logic that already exists in a repository or shared utility.
- Prefer surgical edits over broad refactors.
- If a task touches Prisma models, keep generated client output and schema alignment consistent.

## Quick orientation summary
- `frontend/` is the experience layer.
- `server/` is the business/data layer.
- `auth`, `property`, `wallet`, `booking`, `rentrequest`, `chat`, and `notification` are the central domain areas.
- access control and workflow rules are role-sensitive and should be respected in both UI and API layers.
