# Adjust NODE_VERSION as desired
FROM node:21-alpine3.18 as base

LABEL fly_launch_runtime="Node.js/Prisma"

# Node.js/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apk update -qq && \
    apk add --no-cache build-base nodejs npm openssl pkgconfig python3

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Generate Prisma Client
COPY prisma .
RUN npx prisma generate

# Run seed script
COPY prisma/seed.js ./prisma/
RUN node ./prisma/seed.js

# Copy application code
COPY . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apk update -qq && \
    apk add --no-cache openssl && \
    rm -rf /var/cache/apk/*

# Copy built application
COPY --from=build /app /app

# Setup sqlite3 on a separate volume
RUN mkdir -p /data
VOLUME /data

# Entrypoint prepares the database.
ENTRYPOINT [ "/app/docker-entrypoint.js" ]

# Start the server by default, this can be overwritten at runtime
EXPOSE 5000
ENV DATABASE_URL="file:///data/sqlite.db"

CMD [ "npm", "run", "start" ]
