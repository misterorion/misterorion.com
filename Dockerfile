FROM node:18-alpine AS builder
ARG BASIC_AUTH
ENV PUBLIC_BASIC_AUTH=$BASIC_AUTH
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM caddy:2-alpine
COPY --from=builder /app/dist /srv
COPY ./Caddyfile /etc/caddy/Caddyfile