# Mingle

A simple, real-time chat app for one-to-one conversations.

[**Live demo**](https://mingle-chat-one.vercel.app/) · [**GitHub repository**](https://github.com/anujjha01/mingle-chat)

## Features

- Create an account and sign in securely
- Explore with a one-click demo account and sample conversation (demo activity is shared)
- Send text and image messages in real time
- See online status and unread-message notifications
- Update your profile photo
- Switch between light and dark themes
- Store accounts and conversations in PostgreSQL

## Built with

React · Vite · Node.js · Express · Socket.IO · PostgreSQL · ImageKit · Vercel

## Run locally

You’ll need Docker. Clone the repository, copy `.env.example` to `.env`, and set `POSTGRES_PASSWORD` and `JWT_SECRET` to your own values. Then run:

```sh
docker compose up --build
```

Open [http://localhost:5001](http://localhost:5001). Set `IMAGEKIT_PRIVATE_KEY` in `.env` if you want profile and chat image uploads enabled.

## Deployment

The app is deployed on Vercel and uses hosted PostgreSQL. Keep database credentials, the JWT secret, and the optional ImageKit key in your hosting provider’s environment settings; never commit real secrets to Git.
