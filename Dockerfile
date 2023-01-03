FROM node:18 AS builder

WORKDIR /app
COPY package.json ./
COPY prisma ./prisma
RUN npm install

COPY . .

ENV NODE_ENV=production
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

FROM node:18
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/cap.schema.json /app/countries.geojson /app/email-template.html ./

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
