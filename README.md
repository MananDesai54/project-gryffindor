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
- Create Agent, tools, Knowledge base from Ui
- Once done run this curl with your agent
```sh
curl --location 'http://localhost:3000/ai/index/add-document/$agentId' \
--header 'X-AUTH-TOKEN: YOUR_TOKEN' \
--data ''
```
