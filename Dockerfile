# Build the site
FROM node:latest AS BUILD_IMAGE
WORKDIR /app
COPY . .
RUN npm ci && \
    npm run build

# Build the server
FROM caddy:alpine
COPY --from=BUILD_IMAGE /app/public /srv
COPY Caddyfile /etc/caddy/Caddyfile