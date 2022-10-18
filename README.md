# Gantri Backend Challenge

## Setup

System requirements:

- Node.js (developed against node 16)
- NPM (developed against npm 8)
- A Postgres database (Dockerized is fine)

To run:

- `npm install`
- setup DB
  Easiest way to do this:
  ```sh
  docker run --name gantri-challenge-dev \
    -p 5434:5432 \
    -e POSTGRES_USER=gantri \
    -e POSTGRES_PASSWORD=xxx \
    -e POSTGRES_DB=tate-modern \
    -d postgres:15-alpine
  ```
  Then
  ```sh
  cp .env.sample .env
  ```
  and update `.env` appropriately (setting, in particular, `DB_PORT`, `DB_USER`, and `DB_PW`)
- migrate and (optionally) seed
  ```sh
  npx sequelize-cli db:migrate
  npx sequelize-cli db:seed --seed 20221014190222-bootstrap-artwork
  npx sequelize-cli db:seed --seed 20221015204925-create-users
  ```
  The `bootstrap` seeder will populate the artworks table with the contents of the [Tate Modern dataset](data/the-tate-collection.csv). The users seeder will create two users.
- `npm start`


## Tests

```sh
npm run test
```
