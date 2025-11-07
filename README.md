# CrowdScreen — Live Community Content Review

CrowdScreen is a small full-stack web app that lets users submit posts and lets moderators review them in a **live moderation queue**.

The goal is to demonstrate:

- A Nuxt 3 app with both **frontend + backend**.
- A **MongoDB** data model for users, content, rules, flags, and decisions.
- A simple **rule-based content flagging** pipeline.
- A **real-time** Socket.IO-powered moderator queue.
- Production-minded patterns: JWT auth, seeding, Docker, Kubernetes manifests, and E2E testing.

This project is built as the final project for an **Advanced Web Application Development** course and as a portfolio piece for SDE/SWE internships.

---

## Features (current & planned)

**Implemented (baseline)**

- ✅ Nuxt 3 + TypeScript app
- ✅ MongoDB integration via Mongoose
- ✅ JWT-based authentication (register + login)
- ✅ Seed script to create:
  - `admin@demo.dev` (admin)
  - `mod@demo.dev` (moderator)
  - default moderation rules
- ✅ REST APIs:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/items` (pending/approved/rejected)
  - `POST /api/items` (submit content)
  - `GET /api/rules`
  - `POST /api/rules`
  - `POST /api/decisions` (moderator decision)
  - `GET /api/metrics`
- ✅ Basic Nuxt pages:
  - `/` — landing
  - `/submit` — submit content form (4+ fields)
  - `/queue` — moderation queue
  - `/rules` — manage rules
- ✅ Global Socket.IO server plugin (Nuxt server-side) ready for real-time updates

**Planned (course extras & polish)**

- 🔜 Real-time queue updates wired into `/queue` via Socket.IO
- 🔜 Role-based UI (user vs moderator vs admin)
- 🔜 Basic E2E tests (Playwright) covering:
  - login
  - submit content
  - see item appear in queue
- 🔜 Docker image + `docker-compose` for local dev
- 🔜 Kubernetes manifests for app + Mongo deployment
- (Optional) OAuth login & more advanced RBAC

---

## Tech Stack

- **Frontend & Backend:** Nuxt 3, TypeScript
- **UI:** Vue 3, Tailwind CSS
- **Backend runtime:** Nuxt server routes (Nitro)
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (HTTP Authorization header)
- **Real-time:** Socket.IO (server plugin)
- **Tooling:** TypeScript, Playwright (E2E), Docker, Kubernetes (manifests)

---

## Data Model (high level)

- **User**
  - `email`, `name`, `passwordHash`, `role` (`user | moderator | admin`)
- **Item**
  - Submitted content: `authorId`, `type`, `payload`, `status` (`pending | approved | rejected`)
- **Rule**
  - `name`, `type` (`keyword | regex | threshold`), `config`, `enabled`, `score`
- **Flag**
  - `itemId`, `ruleId`, `reason`, `score`
- **Decision**
  - `itemId`, `moderatorId`, `decision`, `notes`

Flow (simplified):

1. User submits content → `POST /api/items`.
2. Rules engine evaluates content → creates `Flag`s + sets `status`.
3. Moderators see pending items in `/queue`.
4. Moderator approves/rejects → `POST /api/decisions` updates `Item` + emits event.

---

## Getting Started (Local Dev)

### 1. Prerequisites

- Node.js 18+ (20+ recommended)
- Docker (for MongoDB)
- npm

### 2. Clone & install

```bash
git clone https://github.com/<your-username>/crowdscreen.git
cd crowdscreen
npm install
