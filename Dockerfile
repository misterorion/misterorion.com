FROM gcr.io/cloud-builders/yarn AS builder
WORKDIR /app
COPY . .
RUN yarn install --production && yarn build

FROM caddy:alpine
WORKDIR /app
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/public /srv