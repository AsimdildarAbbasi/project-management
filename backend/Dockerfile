# ---------- Build / Dependency Stage ----------
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

# ---------- Production Runtime Stage ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

USER node

COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node package*.json ./
COPY --chown=node:node server.js ./
COPY --chown=node:node src/ ./src/

EXPOSE 5000

CMD ["node", "server.js"]
