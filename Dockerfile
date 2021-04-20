# Build the site
FROM node:15 AS BUILD_IMAGE
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Build the server
FROM caddy:alpine
COPY --from=BUILD_IMAGE /usr/src/app /srv
COPY Caddyfile /etc/caddy/Caddyfile