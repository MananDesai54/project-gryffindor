FROM oven/bun:1 AS base
WORKDIR /app

COPY packages/client/package.json .
RUN bun install

COPY packages/client .

# RUN bun test
# RUN bun run build

EXPOSE 3001/tcp
ENTRYPOINT [ "bun", "run", "dev" ]
