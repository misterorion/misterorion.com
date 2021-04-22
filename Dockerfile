FROM node:latest AS builder
WORKDIR /usr/src/app
COPY . .
RUN npm install && \
    npm run build

FROM caddy:alpine
WORKDIR /usr/src/app
COPY --from=builder ./Caddyfile /etc/caddy/Caddyfile
COPY --from=builder ./public /srv