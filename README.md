# project-gryffindor
Agentic Framework for creating, maintaining, and collaborating with agents

# Improve later
- move to nest workspace
- Better error handling, module specific error
- Logging
- NestJS best practices
- Separate internal app
- CORS, req logging, security
- better way for update request
- pagination
- remove url like get-standard-llm and move to filters, fields, dimensions and common query
- default model via property

# next build
- Ui for Agent creation
- Agent list screen + api
- upload service for kb
- rag and vector db
- Ai inference api
- Ai inference screen
- LLM monitoring
- add animations

# Agent should be able to build
- Gmail RAG
- HR Workflow automation

# How to run?
- install bun
- install docker
```sh
git clone https://github.com/manandesai54/project-gryffindor.git
cd project-gryffindor
bun install
bun run dev:client
bun run dev:server
```
- run following internal services to setup initial environment
```sh
# create user
curl --location 'http://localhost:3000/user/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "manandesai54",
    "email": "manan@gmail.com",
    "password": "Manan@123"
}'

# create standard llms
curl --location 'http://localhost:3000/ai/internal/llm/create-standard-llms'
```
