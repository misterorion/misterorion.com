FROM caddy:alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY ./public /srv