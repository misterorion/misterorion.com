---
title: "Building Gatsby with Google Cloud"
excerpt: "Using Google Cloud Build"
tags: ["Gatsby","GCP","Cloud" ]
---

A Cloud Build setup that caches `node_modules` and Gatsby-specific build folders. It also cleans your website bucket before deploying and sets cache-control headers that are appropriate for Gatsby. Caching really speeds up the builds and gives you almost Netlify-like speeds.

Several environment variables need to be set in your Cloud Build trigger:

**`_CACHE_BUCKET`** is set to the bucket location where you want to cache your `node_modules`, and Gatsby `.cache` and `public` folders.

**`_WEBSITE_BUCKET`** is set to the bucket location that serves your site.

`TRIGGER_NAME` is a built in variable and does **not** need to be set.

There are some things to be aware of. Number one is I'm not sure if the website bucket really needs to be cleaned out before deployment, although it does make viewing the files in the console more human readable. Number two is that the `gsutil setmeta` commands are "Class A" storage operations so they do accumulate some cost, although not much. There may be a better way to set the metadata.

```yaml
# cloudbuild.yaml
steps:
  # If a cache exists, fetch it from Cloud Storage
  - id: Fetch cache
    name: gcr.io/cloud-builders/gcloud
    entrypoint: sh
    args:
      - -c
      - |
        (
          set -e
          gsutil hash -h yarn.lock | grep md5 | tr -s " " | awk '{print $3}' > hashed.yarn-lock
          gsutil -m cp "gs://$_CACHE_BUCKET/$TRIGGER_NAME/$(cat hashed.yarn-lock)" cache.tar.gz 2> /dev/null
          test -f cache.tar.gz
          tar -zxf cache.tar.gz
          echo "Using cache from: gs://$_CACHE_BUCKET/$TRIGGER_NAME/$(cat hashed.yarn-lock)"
        ) || true
  # Install Node dependencies
  - id: Yarn install
    name: node
    entrypoint: sh
    args:
      - -c
      - |
        test -f cache.tar.gz || yarn install --prod --pure-lockfile
  # Build Gatsby site
  - id: Yarn build
    name: node
    entrypoint: yarn
    args:
      - build
    env:
      - GATSBY_TELEMETRY_DISABLED=true
  # Empty website bucket
  - id: Empty bucket
    name: gcr.io/cloud-builders/gcloud
    entrypoint: sh
    args:
      - -c
      - |
        (
          set -e
          gsutil -q -m rm -f gs://$_WEBSITE_BUCKET/**
        ) || true
    waitFor:
      - Yarn build
  # Cache node_modules and Gatsby-specific cache directories
  - id: Save cache
    name: gcr.io/cloud-builders/gcloud
    entrypoint: sh
    args:
      - -c
      - |
        tar -zcf cache.tar.gz node_modules public .cache
        gsutil -m cp cache.tar.gz "gs://$_CACHE_BUCKET/$TRIGGER/$(cat hashed.yarn-lock)"
    waitFor:
      - Yarn build
  # Copy files to website bucket
  - id: Copy to bucket
    name: gcr.io/cloud-builders/gcloud
    entrypoint: sh
    args:
      - -c
      - |
        gsutil -q -m cp -R -z css,html,js,json,map public/* gs://$_WEBSITE_BUCKET
    waitFor:
      - Empty bucket
  # Set Gatsby-specific caching
  - id: Set cache-control metadata
    name: gcr.io/cloud-builders/gcloud
    entrypoint: bash
    args:
      - -c
      - |
        gsutil -q -m setmeta -h "Cache-Control:public,max-age=0,must-revalidate" gs://$_WEBSITE_BUCKET/**/**
        gsutil -q -m setmeta -h "Cache-Control:public,max-age=31536000,immutable" gs://$_WEBSITE_BUCKET/static/**
        gsutil -q -m setmeta -h "Cache-Control:public,max-age=31536000,immutable" gs://$_WEBSITE_BUCKET/**/**.{css,js}
        gsutil -q -m setmeta -h "Cache-Control:public,max-age=0,must-revalidate" gs://$_WEBSITE_BUCKET/sw.js
    waitFor:
      - Copy to bucket
```