FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN npm ci --prefix frontend
COPY frontend ./frontend
RUN npm run build --prefix frontend

COPY backend/package*.json ./backend/
RUN npm ci --omit=dev --prefix backend
COPY backend ./backend

ENV NODE_ENV=production
EXPOSE 5001
CMD ["node", "backend/src/index.js"]
