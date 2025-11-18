# CrowdScreen — Live Community Content Review

CrowdScreen is a small full-stack web app where users submit posts and moderators review them in a **live queue**. It showcases a production-minded Nuxt 3 stack (TypeScript, MongoDB, JWT, Socket.IO, Playwright, Docker/Kubernetes).

This project is built as the final for **Advanced Web Application Development** and as a portfolio piece for SDE/SWE internships.

---

## Features

**Implemented**

* Nuxt 3 (frontend + server routes) with TypeScript
* MongoDB via Mongoose (Users, Items, Rules, Flags, Decisions)
* JWT auth (register + login)
* Rule-based flagging (keyword/regex/threshold)
* REST API with pagination & role checks
* Real-time queue events (Socket.IO) — emits are **safe/no-op** if Socket.IO isn’t attached (e.g., CI webServer)
* Seed script (admin/moderator + sample rules)
* Playwright E2E (configured in CI)
* Dockerfile + dev `docker-compose`
* Kubernetes manifests (app + Mongo + secrets)

**Planned/Polish**

* Role-aware UI (user/mod/admin)
* More E2E (approve/reject flow, rule CRUD)
* OAuth & RBAC (optional)

---

## Tech Stack

* **App:** Nuxt 3 (Nitro server routes), TypeScript, Vue 3, Tailwind
* **DB:** MongoDB + Mongoose
* **Auth:** JWT (`Authorization: Bearer …`)
* **Realtime:** Socket.IO (server plugin, client via `socket.io-client`)
* **Tooling:** Playwright, Docker, Kubernetes

---

## Data Model (high level)

* **User**: `email`, `name`, `passwordHash`, `role` (`user|moderator|admin`)
* **Item**: `authorId`, `type` (`text|image|link`), `payload`, `status` (`pending|approved|rejected`)
* **Rule**: `name`, `type` (`keyword|regex|threshold`), `config`, `enabled`, `score`
* **Flag**: `itemId`, `ruleId`, `reason`, `score`
* **Decision**: `itemId`, `moderatorId`, `decision` (`approve|reject|escalate`), `notes`

**Flow:** user submits → rules engine flags + sets status → moderators see `/queue` → moderator decides → item updates (+ realtime emit if available)

---

## API (current)

Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

Items & Decisions

* `GET /api/items?status=pending|approved|rejected&page=1&pageSize=10`

  * Users can see `pending`; moderators can see all.
* `POST /api/items` — submit content `{ type, payload }`
* `POST /api/decisions` — `{ itemId, decision, notes }` (moderator)

Rules

* `GET /api/rules`
* `POST /api/rules` — create
* `PUT /api/rules/:id` — update
* `POST /api/rules/:id/toggle` — enable/disable
* `DELETE /api/rules/:id`

Metrics

* `GET /api/metrics`

Dev (for tests/local)

* `GET /api/dev/loginAs?role=moderator&email=mod@demo.dev`

  * Enabled only when `AUTH_DEV_BYPASS="true"`.

---

## Pages

* `/` — landing
* `/login` — login/register (stores JWT via `useAuth()` composable)
* `/submit` — submit content (Type, Category, Tags, Text)
* `/queue` — moderator queue (score, status, approve/reject) + **pagination**
* `/rules` — list/create/toggle/delete rules
* `/metrics` — basic counts

---

## Environment Variables

Create a `.env` for local dev:

```ini
MONGODB_URI=mongodb://127.0.0.1:27017/crowdscreen
JWT_SECRET=dev-super-secret-change-me
AUTH_DEV_BYPASS=true
```

In CI/K8s, these are set via workflow/secret manifests.

---

## Getting Started (Local)

1. **Install deps**

```bash
npm install
```

2. **Start MongoDB** (dev)

```bash
docker compose -f docker/docker-compose.yml up -d mongo
```

3. **Seed DB**

```bash
npm run seed
```

4. **Run dev server**

```bash
npm run dev
# http://localhost:3000
```

**Test accounts after seeding**

* `admin@demo.dev` / `password123`
* `mod@demo.dev` / `password123`

---

## E2E Tests (Playwright)

Local:

```bash
npx nuxt build
npx playwright install --with-deps
npx playwright test
```

The Playwright config starts the built Nitro server (`.output/server/index.mjs`).
In CI, Mongo is provided via a service; env vars are set; tests run headless.

---

## Docker

Build & run app (with Mongo from compose):

```bash
# build app image
docker build -t crowdscreen:local -f docker/Dockerfile .

# or just use compose to build+run app and mongo
docker compose -f docker/docker-compose.yml up --build
# app: http://localhost:3000
```

`docker/docker-compose.yml` launches:

* `mongo` (port 27017)
* `app` (port 3000) with `MONGODB_URI`, `JWT_SECRET`, `AUTH_DEV_BYPASS`

---

## Kubernetes (demo)

Manifests in `k8s/`:

* `secret.yaml` — JWT secret & Mongo URI
* `mongo.yaml` — Mongo `Deployment` + `Service`
* `app.yaml` — App `Deployment` + `Service`

Apply:

```bash
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/mongo.yaml
kubectl apply -f k8s/app.yaml
```

> For real persistence, replace `emptyDir` with a PVC.

---

## Realtime Notes

* The Socket.IO server plugin attaches when an HTTP server is available (Node adapter/dev).
* In environments without that hook (e.g., Nitro webServer in CI), `io` isn’t attached — **emits are safely no-op** to keep API handlers stable.
* The `/queue` page listens to `queue:update` and `item:update` if a client socket is available.

---

## Troubleshooting

* **`Error: MONGODB_URI is not set`**
  Add it to `.env` or your environment (CI/K8s). Start Mongo first.

* **`jwt.sign is not a function`**
  Use default import for `jsonwebtoken` (already fixed):
  `import jwt from 'jsonwebtoken'`

* **Realtime warnings in CI**
  You might see `[socket] No HTTP server, skipping Socket.IO setup` — expected in the CI webServer mode.

---

## Folder Structure (high level)

```
server/
  api/           # server routes (REST)
  models/        # mongoose models
  plugins/       # nitro plugins (socket.io)
  utils/         # auth, db, roles, guards, socket helpers
pages/           # Nuxt pages
composables/     # useAuth()
plugins/         # $api auth header, $socket client
scripts/         # seed.ts
tests/e2e/       # Playwright
docker/          # Dockerfile, docker-compose.yml
k8s/             # Kubernetes manifests
```

---

## License

MIT

