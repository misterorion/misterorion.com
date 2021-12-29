ARG CADDY_IMAGE
FROM $CADDY_IMAGE
COPY ./srv /srv
COPY ./Caddyfile /etc/caddy/Caddyfile
RUN mkdir -p /caddy_config/caddy && chown -R 8879 /caddy_config && ls -lah /caddy_config