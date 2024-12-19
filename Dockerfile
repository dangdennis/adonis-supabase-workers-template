FROM node:22.12.0 AS base

# Build stage with all dependencies
FROM base AS build
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci
ADD . .
RUN npx prisma generate
RUN npm run build

# Production deps stage (after Prisma generation)
FROM base AS production-deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/node_modules/@prisma/client /app/node_modules/@prisma/client

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
EXPOSE 8080
CMD ["node", "./bin/server.js"]
