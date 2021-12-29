ARG CADDY_IMAGE
FROM $CADDY_IMAGE
COPY ./srv /srv
COPY ./Caddyfile /etc/caddy/Caddyfile
RUN mkdir -p -m 600 /config/caddy && chown -R 8879 /config/caddy