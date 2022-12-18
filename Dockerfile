FROM node:18 AS builder

WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY . .

ENV NODE_ENV=production
RUN pnpm install -r --offline
RUN npx prisma generate
RUN npm run build
RUN pnpm prune --prod

FROM node:18
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["npm", "run", "start"]
