# project-gryffindor
Agentic Framework for creating, maintaining, and collaborating with agents

# Improve later
- Better error handling, module specific error
- Logging
- NestJS best practices
- Separate internal app
- CORS, req logging, security
- better way for update request
- pagination

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
curl to create user
curl to create standard LLMs
```
