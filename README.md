# Gantri Backend Challenge

## Setup

System requirements:

- Node.js (developed against node 16)
- NPM (developed against npm 8)
- A Postgres database (developed against one running with Docker)

To run:

- `npm install`
- setup DB
  ```sh
  docker run --name gantri-challenge-dev \
    -p 5434:5432 \
    -e POSTGRES_USER=gantri \
    -e POSTGRES_PASSWORD=xxx \
    -e POSTGRES_DB=tate-modern \
    -d postgres:9.6.2-alpine
  ```
  ```sh
  cp .env.sample .env
  ```
  and update `.env` appropriately
- `npx sequelize-cli db:migrate`
- `npx sequelize-cli db:seed --seed 20221014190222-bootstrap-artwork`
- `npm start`
