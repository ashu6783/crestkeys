ARG NODE_VERSION=22.1.0

# --- Build stage ---
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Production stage ---
FROM node:${NODE_VERSION}-alpine AS production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

RUN chown -R node:node /usr/src/app

USER node

EXPOSE 5000

CMD ["node", "dist/index.js"]
