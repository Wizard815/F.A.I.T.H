# FAITH: Node server + React web app in one image.
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/package.json server/
COPY web/package.json web/
RUN npm ci --no-audit --no-fund
COPY server server
COPY web web
RUN npm run build && npm prune --omit=dev

FROM node:22-slim
ENV NODE_ENV=production \
    PORT=8097 \
    FAITH_DATA=/data \
    FAITH_CONFIG=/config/faith.yaml \
    FAITH_WEB=/app/web/dist \
    NODE_NO_WARNINGS=1
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/package.json server/
COPY web/package.json web/
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/server/dist server/dist
COPY --from=build /app/web/dist web/dist
COPY server/skills server/skills
COPY config/faith.example.yaml /app/faith.example.yaml
RUN printf '#!/bin/sh\nexec node /app/server/dist/cli.js "$@"\n' > /usr/local/bin/faith && chmod +x /usr/local/bin/faith \
 && mkdir -p /data /config && chown -R node:node /data /config
USER node
VOLUME ["/data", "/config"]
EXPOSE 8097 10300
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8097)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server/dist/index.js"]
