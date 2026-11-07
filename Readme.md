# Khidma

Khidma is a bilingual marketplace platform for connecting clients with
freelancers. The application provides authentication, profiles, services,
tasks, categories, and an admin-managed landing page. Arabic and English are
supported, including right-to-left layout for Arabic.

## Repository structure

```text
khidma/
├── frontend/   # Next.js application
└── server/     # Express API, PostgreSQL access, and Drizzle migrations
```

## Technology stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, next-intl
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL with Drizzle ORM and Drizzle Kit
- **Authentication:** JWT and bcrypt
- **Validation:** Zod
- **Security and operations:** Helmet, CORS, rate limiting, and Morgan

## Prerequisites

- Node.js `24.22.1` or newer
- npm
- PostgreSQL

## Getting started

### 1. Install dependencies

Install dependencies independently for each application:

```bash
cd server
npm install

cd ../frontend
npm install
```

### 2. Configure the API

Create `server/.env.dev` for local development:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/khidma_db
JWT_SECRET=replace-with-a-random-string-of-at-least-32-characters
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
PORT=3001
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
APP_STAGE=dev
```

`DATABASE_URL` and `JWT_SECRET` are required. Never commit real credentials or
secrets to the repository.

### 3. Configure the frontend

Create `frontend/.env.local`:

```env
EXPRESS_API_URL=http://localhost:3001/api
```

### 4. Prepare the database

Create the `khidma_db` PostgreSQL database, then run the migrations:

```bash
cd server
npm run db:migrate
```

To generate a new migration after changing the Drizzle schema:

```bash
npm run db:generate
npm run db:migrate
```

The seed command is available for local sample data:

```bash
npm run db:seed
```

### 5. Start the applications

Run the API in one terminal:

```bash
cd server
npm run dev
```

Run the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The applications are then available at:

- Frontend: <http://localhost:3000>
- API: <http://localhost:3001>
- Health check: <http://localhost:3001/health>

## API overview

All API routes are prefixed with `/api`.

| Area | Routes |
| --- | --- |
| Authentication | `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh` |
| Categories | `/categories`, `/categories/landing`, `/categories/:id` |
| Services | `/services`, `/services/all`, `/services/:id` |
| Tasks | `/tasks`, `/tasks/all`, `/tasks/:id` |
| Profile | `/profile`, `/profile/change-password` |
| Users | `/users` |

Routes that modify user data require a valid JWT. Administrative category
operations additionally require an administrator account.

## Available commands

### Frontend

Run these commands from `frontend/`:

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Serve the production build
npm run lint      # Run ESLint
```

### Backend

Run these commands from `server/`:

```bash
npm run dev          # Start the API with watch mode
npm run start        # Start the production-stage process
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Apply migrations
npm run db:push      # Push the schema directly
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed the database
```

## Localization

The frontend supports:

- Arabic: `/ar`
- English: `/en`

Translations are stored in `frontend/src/dictionaries/`. The locale
configuration and text direction handling are defined in
`frontend/src/lib/i18n/`.

## Contributing

1. Create a feature branch.
2. Keep frontend and backend changes in their respective directories.
3. Run the relevant lint, build, type-check, and migration checks.
4. Do not commit `.env` files, credentials, or generated dependency folders.
5. Open a pull request with a concise description of the change and its
   validation steps.

## License

No license has been specified yet.