# Mingle

Mingle is a real-time messaging app with a responsive interface, JWT-based accounts, online presence, and persistent one-to-one conversations. It is built with React, Express, Socket.IO, and PostgreSQL.

## Features

- Sign up, sign in, and protected account sessions
- Real-time direct messages and online status with Socket.IO
- PostgreSQL storage for users and conversation history
- Responsive contact list, contact search, and theme previews
- Optional profile and message image uploads through ImageKit
- Docker Compose setup for the app and PostgreSQL

## Run with Docker

1. Copy `.env.example` to `.env` and set a strong `JWT_SECRET` and `POSTGRES_PASSWORD`.
2. Start the app with `docker compose up --build`.
3. Open [http://localhost:5001](http://localhost:5001). The API health endpoint is `/api/health`.

The database tables are created automatically on first startup. Docker keeps PostgreSQL data in the `postgres_data` volume.

## Run locally without Docker

Use Node.js 20 or newer and a PostgreSQL database. Create a database, then set `DATABASE_URL` and `JWT_SECRET` in `backend/.env`:

```env
DATABASE_URL=postgres://postgres:password@localhost:5432/mingle
JWT_SECRET=use-a-long-random-secret
PORT=5001
NODE_ENV=development
# Optional; set this to enable ImageKit uploads.
IMAGEKIT_PRIVATE_KEY=
```

Install and start the backend and frontend in separate terminals:

```sh
npm ci --prefix backend
npm run dev --prefix backend
```

```sh
npm ci --prefix frontend
npm run dev --prefix frontend
```

Open the local Vite URL shown in the frontend terminal. The backend creates its schema when it connects.

## Optional image uploads

Set `IMAGEKIT_PRIVATE_KEY` in the backend environment to enable profile and message image uploads. The key stays on the server and is never sent to the browser. Accounts, text messages, and live messaging work without this setting.

## Production deployment

Build and run the included Docker image with a managed PostgreSQL database. Set `NODE_ENV=production`, `DATABASE_URL`, `DATABASE_SSL=true` when required by the database provider, and `JWT_SECRET`. Keep credentials in the hosting provider's secret settings, not in Git. A Render Blueprint is included in `render.yaml`.

## Stack

React · Vite · Tailwind CSS · DaisyUI · Zustand · Node.js · Express · PostgreSQL · Socket.IO · JWT · ImageKit · Docker
