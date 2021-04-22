FROM gcr.io/cloud-builders/yarn AS builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile --silent && yarn build

FROM caddy:alpine
WORKDIR /app
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/public /srv