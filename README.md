## technologies

- Typescript
- Nestjs
- TypeOrm
- Socket.io

## environment

### .env file

`cp .env.development.example .env.development.local`

`cp .env.development.host.example .env.development.host.local`

### containers

- `docker compose up` then start app and db container
- modify container port expose
- apply database schema exec `make migration`
- Migrations will be executed from the host machine, so please adjust the hostname and port as necessary. It is written in .env.development.local.host

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
- You cant input nickname and login.
- You can select room and join chatRoom.
  - You can view all past messages within the room.
  - You can edit your own messages.
  - Members who are logged in will be visible as Members.

### design

#### delete chatRoom

- You cannot delete if there are users present.
- Only the owner can delete.
- Considering the increase in data volume, including messages, and the complexity of the code logic, I designed the system to use archive tables for chatRooms and messages, and the deletion process will be transitioned to those tables.


### testing
- only e2e test

`make testing`

- When parallel execution is used, the test fails due to data inconsistency because of the use of databases. Therefore, test one by one.
