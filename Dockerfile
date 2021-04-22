FROM node:latest AS builder
WORKDIR /usr/src/app
COPY . .
RUN npm install && \
    npm run build

FROM caddy:alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /usr/src/app/public /srv