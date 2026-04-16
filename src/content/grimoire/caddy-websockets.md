---
title: "Websockets and Caddy"
tags: ["Caddy"]
---

The snippet below works well for Caddy v2 running behind a load balancer with a websockets container `api` running on port 3000.

The `handle` directives ensures traffic to the websockets service and the main site are mutually exclusive. Additionally, the named matcher `@websockets` will upgrade all protocol upgrade requests.

```caddy
# Caddyfile

domain.com {
	@websockets {
		header Connection *Upgrade*
		header Upgrade websocket
		path /socket.io/*
	}

	handle @websockets {
		reverse_proxy api:3000
	}

	handle {
		root * /srv
		encode gzip
		file_server
	}
}
```
