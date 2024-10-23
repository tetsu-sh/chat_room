import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1729688603497 implements MigrationInterface {
    name = 'Migrations1729688603497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` DROP FOREIGN KEY \`FK_e3b9a8a898a459cb91b2ee97350\``);
        await queryRunner.query(`DROP INDEX \`REL_e3b9a8a898a459cb91b2ee9735\` ON \`chat_rooms\``);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` CHANGE \`user_id\` \`owner_id\` varchar(36) NULL`);
        await queryRunner.query(`CREATE TABLE \`messages\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`content\` varchar(255) NOT NULL, \`chatRoom_id\` varchar(36) NULL, \`owner_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_33afa95be605a69d9dc7de2811\` (\`content\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`chat_room_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` ADD UNIQUE INDEX \`IDX_52c8dcc9f1ba9030439699e8b6\` (\`owner_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_52c8dcc9f1ba9030439699e8b6\` ON \`chat_rooms\` (\`owner_id\`)`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_3c77641a9c908fa0ad4579ab911\` FOREIGN KEY (\`chatRoom_id\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_1668626956fd00acef4b93d2943\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` ADD CONSTRAINT \`FK_52c8dcc9f1ba9030439699e8b69\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_ff91a2ca355acb4d7585b6b606d\` FOREIGN KEY (\`chat_room_id\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_ff91a2ca355acb4d7585b6b606d\``);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` DROP FOREIGN KEY \`FK_52c8dcc9f1ba9030439699e8b69\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_1668626956fd00acef4b93d2943\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_3c77641a9c908fa0ad4579ab911\``);
        await queryRunner.query(`DROP INDEX \`REL_52c8dcc9f1ba9030439699e8b6\` ON \`chat_rooms\``);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` DROP INDEX \`IDX_52c8dcc9f1ba9030439699e8b6\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`chat_room_id\``);
        await queryRunner.query(`DROP INDEX \`IDX_33afa95be605a69d9dc7de2811\` ON \`messages\``);
        await queryRunner.query(`DROP TABLE \`messages\``);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` CHANGE \`owner_id\` \`user_id\` varchar(36) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_e3b9a8a898a459cb91b2ee9735\` ON \`chat_rooms\` (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` ADD CONSTRAINT \`FK_e3b9a8a898a459cb91b2ee97350\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
