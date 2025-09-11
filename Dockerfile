FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY .env ./.env
COPY prisma ./prisma

RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env

# is this necessary
RUN npx prisma generate  

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
