FROM node:alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install && \
    npm run build

FROM caddy:alpine
WORKDIR /usr/src/app
COPY --from=builder ./Caddyfile /etc/caddy/Caddyfile
COPY public /srv