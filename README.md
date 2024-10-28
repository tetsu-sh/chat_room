## technologies

- Typescript
- Nestjs
- TypeOrm
- Socket.io

## environment

- you need pnpm, make

### .env file

`cp .env.development.example .env.development.local`

### containers

- `docker compose up` then start app and db container
- modify container port expose as necessary.
- execute `make migration`, apply database schema

### api

- You need to create users and chat rooms using the following API. For more details, please refer to the Swagger API at `/api`.
- create user.
  - POST user/login
- create chatRoom
  - POST chatRoom
    - input is below
      - room name(whatever you want, but unique )
      - useId(response of user/login) who are owner of chatRoom

### chat

- you can chat in [index.html](index.html)
- You cant input nickname and login.(create new user as well )
- You can select room and join chatRoom.
- In chatRoom
  - You can view all past messages within the room.
  - You can edit your own messages.
  - Members who are logged in will be visible as Members.

### design

#### delete chatRoom

- Considering the increase in data volume, including messages, and the complexity of the code logic, I designed the system to use archive tables for chatRooms and messages, and the deletion process will be transitioned to those tables.

### testing

- only e2e test
  `cp env.test.example env.test.local`
  `make testing`
- app, db container will be used , so you need to do docker compose up

- When parallel execution is used, the test fails due to data inconsistency because of the use of databases. Therefore, test one by one.
