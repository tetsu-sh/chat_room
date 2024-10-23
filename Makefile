migration:
	pnpm run typeorm migration:run  --dataSource src/dataSource.ts;

migration-down:
	pnpm run typeorm migration:revert  --dataSource src/dataSource.ts;

migration-gen:
	pnpm run typeorm migration:generate migrations/${MIG_NAME}  --dataSource src/dataSource.ts