migration:
	pnpm run typeorm migration:run  --dataSource src/dataSource.ts;

migration-down:
	pnpm run typeorm migration:revert  --dataSource src/dataSource.ts;

migration-gen:
	pnpm run typeorm migration:generate migrations/${MIG_NAME}  --dataSource src/dataSource.ts

refresh-local-db:
	echo 'DROP DATABASE chat_app; CREATE DATABASE chat_app' | mysql -u kuroneko -ppassword --database chat_app -h 127.0.0.1 -P 3406
testing:
	pnpm test:e2e --runInBand --forceExit --detectOpenHandles