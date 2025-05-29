# Stage 1: Build using Bun with Alpine
FROM oven/bun:1.1.9-alpine AS builder

# Install git and curl
RUN apk add --no-cache git curl

WORKDIR /app

# Clone full repo with submodules (replace with your actual repo)
ARG REPO=https://github.com/Conduit-BTC/conduit-market-client.git
ARG REF=main

RUN git clone --recurse-submodules --depth=1 --branch $REF $REPO .

# Build external schema package
RUN cd external/nostr-commerce-schema && bun install && bun run build

# Build main app
RUN bun install
RUN bun run build

# Stage 2: Serve with Caddy
FROM caddy:2.7.6-alpine

WORKDIR /srv

COPY --from=builder /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
