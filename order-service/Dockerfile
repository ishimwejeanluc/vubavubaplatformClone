# Multi-stage build for Order Service
# Stage 1: Build dependencies
FROM node:22.14.0-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production runtime
FROM node:22.14.0-alpine AS runner
WORKDIR /app

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy all application files except node_modules
COPY . .
# Remove node_modules from the copied files (we already have optimized ones)
RUN rm -rf node_modules
COPY --from=deps /app/node_modules ./node_modules


# Define the command to run the application
CMD ["node", "server.js"]
