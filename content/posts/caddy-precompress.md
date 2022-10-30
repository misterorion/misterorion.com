---
title: "Precompressed Brotli and Gzip with Caddy"
date: "2021-12-23"
slug: "caddy-server-brotli"
description: "You are serving your website with Caddy. Great! You’re an awesome person. Become even more awesome and serve your assets using the exciting Brotli compression algorithm."
imageFixed: "../images/vapor.jpg"
imageAlt: "Caddy Server"
tags: ["Caddy","Linux","GCP"]
---

## Gzip and Brotli

Gzip is supported in virtually in all browsers, having been around since 1993. It is a file format, rather than an algorithm (although it is based on DEFLATE under the hood). Tried and true, it provides respectible compression and is blazing fast on modern hardware.

Developed by Google and released in 2013 as a way to compress web fonts, Brotli (not to be confused with the vegetable) is a relative newcomer, but its algorithm provides better overall compression than Gzip. Akamai found that Brotli was  21% better at compressing HTML, 14% better at compressing JavaScript, and 17% better at compressing CSS. Brotli support in browsers is [extremely high](https://caniuse.com/brotli) and getting higher, but still not as ubiquitous as Gzip.

## What to Compress?

It's a somewhat convoluted and perhaps controversial topic, but a common practice is to only compress files larger than 1,500 bytes.

The reasoning behind this states: "The most common maximum transmission unit (MTU) on the Internet is 1,500 bytes. Therefore, compressing files smaller than 1,500 bytes has no effect."

For example, if you were to compress a file to 400 bytes and send it, the containing packet will still occupy 1,500 bytes on the wire, thus negating the benefit of compression. 

All that said, 1,400 bytes is a good starting point (accounting for packet headers) so we'll be using that going forward.

## Functional Spec

Moving along, here's our little functional spec. 

Our implementation should:

- Serve precompressed Brotli files by default
- Serve precompressed Gzip files if the user's browser doesn't support Brotli
- Serve precompressed files only if they are >= 1,400 bytes

> It's not a bad idea to allow falling back to Gzip in case the users browser doesn't support Brotli, or to handle other edge cases.

## How Can We Accomplish All of This?

### Bash Command

We start with a folder of static website files. In this example we use the `srv` directory.

We'll construct a bash one-liner to recursively find files of certain extensions larger than 1,400 bytes, and create both `.br` and `.gz` compressed versions. We want original files to remain intact as well with the `-k` (keep) flag.

```bash
find ./srv -type f -size +1400c \
    -regex ".*\.\(css\|html\|js\|json\|svg\|xml\)$" \
    -exec brotli --best {} \+ \
    -exec gzip --best -k {} \+
```

> The `find` command does not accept Bash globbing within its parameters, and uses [Emacs-style regex](https://www.emacswiki.org/emacs/RegularExpression). Keep that in mind when tweaking the above for your use case.

> \\+ is a `find` command delimiter, allowing you to chain -exec commands together. `{}` will be replaced with the file's path.

Generally, we want to use highest level of compression for both Gzip and Brotli. This requires the most compute power up-front, but will produce the smallest files.

To put this in perspective, the command above takes my 16-thread desktop CPU just a couple of seconds to process all ~250 files files on this site.

When this command runs on my GCP free-tier Cloud Build instance it takes around 30 seconds. Take that into consideration if you are using a hosted build platform or have smaller compute resources.

If you have a gargantuan amount of files to process, you might want to lower the compression level to get a good ratio of speed/size, or rethink your build strategy.

### Caddyfile

Next, we update our Caddyfile to serve the precompressed files. We do this by using the `file_server` directive.

```caddy
# Caddyfile

file_server {
	precompressed br gzip
	root /srv
}

```

From the Caddy [docs](https://caddyserver.com/docs/caddyfile/directives/file_server#syntax):

> **precompressed** is the list of encoding formats to search for precompressed sidecar files. Arguments are an ordered list of encoding formats to search for precompressed sidecar files. Supported formats are `gzip`, `zstd` and `br`.

In other words, using our example, if the request `User-Agent` header advertises that the client can accept Brotli, those files will be sent. Second in line are Gzip files (if supported), followed by the uncompressed versions.

All too easy. Thanks, Caddy!

## All the Code

### Sample Caddyfile for a Gatsby Site

> In my case, Caddy runs as a docker container on Kubernetes behind a load balancer that handles TLS termination. Thus, I'm not using Caddy's [automatic https feature](https://caddyserver.com/docs/automatic-https) (although it's a fantastic feature). I also disable the admin endpoint since I don't need it.

```caddy
# Caddyfile

{
    admin off
    auto_https off
}
:80
file_server {
    precompressed br gzip
    root /srv
}

header {
    Content-Security-Policy "default-src https: data: 'unsafe-inline'"
    Referrer-Policy "strict-origin-when-cross-origin"
    Strict-Transport-Security "max-age=63072000; includeSubDomains"
    X-Content-Type-Options "nosniff"
    X-Frame-Options "DENY"
    X-XSS-Protection "1; mode=block"
}

@immutable {
    path *.js *.css
    path /static/*
    not path /sw.js
}
route {
    header Cache-Control public,max-age=0,must-revalidate
    header @immutable Cache-Control public,max-age=31536000,immutable
}
```

### Simplified Dockerfile

Copy the `srv` directory and the tweaked Caddyfile into the image.

```dockerfile
# Dockerfile

COPY ./srv /srv
COPY ./Caddyfile /etc/caddy/Caddyfile
```

### Simplified Cloud Build Script

A simplified version of my `cloudbuild.yaml`. 

Substutition for `$_BROTLI_BIN` is the URI of my gzipped copy of the Brotli binary on GCS.

Substitution for `$_APP_IMAGE` is a private repository on Artifact Registry storing the Docker image of my site.

```yaml
# cloudbuild.yaml

steps:
  - id: Yarn build
    name: node
    entrypoint: bash
    args:
      - -c
      - |
        yarn install --prod --frozen-lockfile
        yarn build
  - id: Precompress files
    name: gcr.io/cloud-builders/gcloud
    entrypoint: bash
    args:
      - -c
      - |
        gsutil -q -m cp $_BROTLI_BIN brotli.tar.gz && tar -zxf brotli.tar.gz
        find ./srv -type f -size +1400c \
          -regex ".*\.\(css\|html\|js\|json\|svg\|xml\)$" \
          -exec ./brotli --best {} \+ \
          -exec gzip --best -k {} \+
  - id: Build and push image
    name: gcr.io/cloud-builders/docker
    entrypoint: bash
    args:
      - -c
      - |
        docker build -t $_APP_IMAGE:latest .
        docker push $_APP_IMAGE:latest
```
## Do I Need All This Complexity?

One way to avoid all this trouble would be to use a service like Netlify to deploy your site. They already do a great job handling Brotli and Gzip compression for you. Another way would be to use a CDN that performs on-the-fly Brotli compression, such as KeyCDN, or CloudFront.

But the situation may arise where you don't have access to, or are prohibited from using the above services, for example if you are restricted to using on-prem resources.

Or, you just fancy yourself a crazy hacker and like to roll your own solution, and learn
something in the process!

## Summary

It looks like Brotli is here to stay and I encourage you to try it out if you are seeking some of the benefits. I hope this article gave you some insights into Brotli and how you can start using in your build automataion workflows.

I'd encourage you to give [Caddy](https://caddyserver.com/) a try as well, as it's a fine piece of technology.

Send me a message using the form below with your thoughts or suggestions!
