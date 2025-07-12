# How to run?
- install docker
- install bun (optional for local development)
```sh
git clone https://github.com/manandesai54/project-gryffindor.git
cd project-gryffindor
cp packages/server/env/.env.sample packages/server/env/.env # add your env variables here
bun install # optional for local development
docker-compose up --build -d # server starts on 3000, client on 3001
```
- run following internal services to setup initial environment
```sh
# create user
curl --location 'http://localhost:3000/user/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "YOUR_USER_NAME",
    "email": "YOUR_EMAIL",
    "password": "YOUR_PASSWORD"
}'
# create standard llms
curl --location 'http://localhost:3000/ai/internal/llm/create-standard-llms'
```

# some dummy tools for testing
- check out dummy-api module it has many dummy webhook api endpoint which can be used to test webhook functionality
- There is sample Email action tool in `server/src/ai/ai-tool/constant/ai-tool.constant.ts`
