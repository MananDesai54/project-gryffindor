FROM oven/bun:1 AS base
WORKDIR /app

COPY packages/server/package.json .
RUN bun install

COPY packages/server .

# RUN bun test
# RUN bun run build

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
