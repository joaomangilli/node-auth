## How to run locally

You must have docker and Node 20 setup locally.

```console
docker-compose up
cp .env.example .env
npm i
npm run db
npm run db:create:dev
npm run db:migrate:dev
npm run db:seed:dev
npm run dev
```
