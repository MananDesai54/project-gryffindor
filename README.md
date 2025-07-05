# update to do
- refactor agent inference code
- move text and extracted links to cloud
- kafka flow for async task of Knowledge base

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
- @nestjs/config
- better abstraction in CRUD APIs
- better way for secrets, ignore in docker

# next build
- Add tools Headers screen
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
bun run dev:server
bun run dev:client
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


## Top-level Requirements

- Single agent creation
- Agentic workflows
- Multi-agent collaboration
- Observability for LLM

## Details

- Once logged in User will see 2 options
    1. Create Agents
    2. Interact with Agents
- Agent creation screen
    - User need to give below things to create agents
        - Name and Description
        - LLM (api url, api key, supported multi modality features like image documents)
        - Define tools
            - Tool can be any pubic apis or an agent itself
            - Can also integrate existing MCP servers
        - Chat memory limit
        - Knowledge base (can be of different types)
            - Text
            - Documents
            - Database
            - links
            - some data streams of data queues (like sqs, kafka)
            - an api call to bring data from external sources
        - System prompt
- Agent Inference screen
    - Single Agent inference screen
        - Chat interface
    - Agentic Workflow creation screen
        - Chat + Workflow creation screen
        - based on workflow triggers user can get tasks done.
        - User can add actions for workflows like send email
    - Multi-agent collaboration screen
        - Chat interface with multiple agents collaboration
        - User can tag multiple agents to do some task
- Observability for LLM
    - Token usage tracking
    - Total money spent
    - Agent execution steps logs

## Tech Stack (more things can be added)

- Node.js + NestJS
- React + Shadcn Ui
- Langchain
- MongoDB
- CromaDB
- Langfuse
