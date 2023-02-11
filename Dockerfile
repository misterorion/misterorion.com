FROM node:18-alpine AS builder
ARG BASIC_AUTH
ENV PUBLIC_BASIC_AUTH=$BASIC_AUTH
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM busybox AS compressor
WORKDIR /app
COPY brotli.tar.gz .
COPY --from=builder /app/dist ./dist
RUN tar -zxf brotli.tar.gz && \
    find ./dist -type f -size +1400c \
    -regex ".*\.\(css\|html\|js\|json\|svg\|xml\)$" \
    -exec ./brotli --best {} \+ \
    -exec gzip --best -k {} \+

FROM caddy:2-alpine
RUN caddy version

FROM caddy:2-alpine
COPY --from=compressor /app/dist /srv
COPY ./Caddyfile /etc/caddy/Caddyfile