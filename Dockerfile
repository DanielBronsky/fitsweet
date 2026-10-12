# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_HOME=/corepack \
    NEXT_TELEMETRY_DISABLED=1 \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
COPY package.json /tmp/package.json
RUN corepack enable && cd /tmp && corepack install && chmod -R a+rX /corepack && rm /tmp/package.json
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
ARG NEXT_PUBLIC_SITE_URL=https://fitsweet.md
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    PAYLOAD_SECRET=build-time-only \
    DATABASE_URL=file:/tmp/build.db \
    MEDIA_DIR=/tmp/media \
    TELEGRAM_POLLING=false
RUN mkdir -p /tmp/media && pnpm build && rm -rf .next/cache && CI=true pnpm prune --prod --ignore-scripts >/dev/null

FROM base AS runtime
ENV NODE_ENV=production \
    PATH=/app/node_modules/.bin:$PATH \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATABASE_URL=file:/data/fitsweet.db \
    MEDIA_DIR=/data/media
COPY --from=build --chown=root:root /app /app
RUN chmod +x /app/docker/entrypoint.sh && mkdir -p /data/media /app/.next/cache && chown -R node:node /data /app/.next
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["/app/docker/entrypoint.sh"]
CMD ["next", "start"]
