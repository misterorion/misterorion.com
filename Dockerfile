ARG CADDY_IMAGE
FROM $CADDY_IMAGE
COPY ./srv /srv
COPY ./Caddyfile /etc/caddy/Caddyfile
RUN ls /config
RUN chown -R 8879 /config