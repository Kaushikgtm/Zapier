# Zapier Clone

A workflow automation platform inspired by Zapier. Users create "Zaps" that listen for a trigger (e.g. an incoming webhook) and run one or more actions (e.g. send email, call an API). The system is built as event-driven microservices wired together with Kafka and backed by PostgreSQL.

## What the project does

- Lets a user sign up, log in, and build Zaps (trigger + chain of actions) through a web UI.
- Exposes public webhook URLs that external services can hit to fire a Zap.
- Reliably queues every fired Zap (transactional outbox) and processes actions asynchronously so nothing is lost if a worker crashes.
- Executes actions (email, webhook forward, etc.) via a dedicated worker service.

## Tech stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend services:** Node.js, Express, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Message broker:** Apache Kafka (with Zookeeper)
- **Auth:** JWT
- **Infra:** Docker, Docker Compose

## Architecture

```
                        ┌──────────────────────┐
                        │       Frontend       │
                        │   (Next.js :3001)    │
                        └──────────┬───────────┘
                                   │ REST
                                   ▼
                        ┌──────────────────────┐
                        │   Primary Backend    │
                        │   (Express :3000)    │
                        │  auth / CRUD Zaps    │
                        └──────────┬───────────┘
                                   │ Prisma
                                   ▼
   ┌───────────────┐     ┌──────────────────────┐
   │   Hook svc    │────▶│     PostgreSQL       │
   │ (Express      │     │  users, zaps, runs,  │
   │  :3002)       │     │    outbox table      │
   │ webhook in    │     └──────────┬───────────┘
   └───────────────┘                │
                                    │ polls outbox
                                    ▼
                        ┌──────────────────────┐
                        │      Processor       │
                        │  outbox → Kafka      │
                        └──────────┬───────────┘
                                   │ produce
                                   ▼
                        ┌──────────────────────┐
                        │        Kafka         │
                        │   (topic: zap-runs)  │
                        └──────────┬───────────┘
                                   │ consume
                                   ▼
                        ┌──────────────────────┐
                        │        Worker        │
                        │ executes each action │
                        │  (email, http, ...)  │
                        └──────────────────────┘
```

**Flow:** An external event hits the **Hook** service → it writes a `zapRun` + `zapRunOutbox` row in Postgres (transactional outbox pattern) → the **Processor** reads new outbox rows and publishes them to Kafka → the **Worker** consumes each message and performs the configured actions in order.

## Services

| Service | Port | Responsibility |
|---|---|---|
| `frontend` | 3001 | Next.js UI |
| `primary-backend` | 3000 | Auth + Zap CRUD REST API |
| `hook` | 3002 | Receives external webhooks, enqueues runs |
| `processor` | — | Polls outbox, produces to Kafka |
| `worker` | — | Consumes from Kafka, runs actions |
| `kafka` / `zookeeper` | 9092 | Message broker |

## Run locally

### Prerequisites
- Node.js 18+
- Docker Desktop
- PostgreSQL (local or hosted)

### Option A — Docker Compose (recommended)

1. Create a `.env` file in each service directory (`primary-backend`, `hook`, `worker`, `processor`, `frontend`). Minimum vars:

   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/zapier"
   JWT_PASSWORD="your-secret"
   KAFKA_BROKERS="kafka:9092"
   ```

2. Run migrations once:

   ```bash
   cd primary-backend
   npx prisma migrate dev
   cd ..
   ```

3. Bring everything up:

   ```bash
   docker compose up --build
   ```

4. Open http://localhost:3001

### Option B — run each service manually

Open a terminal per service:

```bash
# 1. Start Kafka + Zookeeper
docker compose up kafka zookeeper

# 2. Primary backend
cd primary-backend && npm install && npx prisma migrate dev && npm run dev

# 3. Hook
cd hook && npm install && npm run dev

# 4. Processor
cd processor && npm install && npm run dev

# 5. Worker
cd worker && npm install && npm run dev

# 6. Frontend
cd frontend && npm install && npm run dev
```

