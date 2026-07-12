# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package files and prisma directory
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including devDependencies (needed to build)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Generate Prisma client and build typescript files
RUN npx prisma generate
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Install openssl and certificates for Prisma support on Alpine Linux
RUN apk add --no-cache openssl ca-certificates

# Copy package files and prisma directory
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --omit=dev

# Copy generated Prisma Client from builder to both places (src/generated/prisma and dist/generated/prisma)
COPY --from=builder /usr/src/app/src/generated/prisma ./src/generated/prisma
COPY --from=builder /usr/src/app/src/generated/prisma ./dist/generated/prisma

# Copy compiled JavaScript files
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 7080

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
