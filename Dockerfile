FROM caddy:alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /usr/src/app/public /srv