import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTable1729781479618 implements MigrationInterface {
    name = 'InitTable1729781479618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`messages\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`content\` varchar(255) NOT NULL, \`chatRoom_id\` varchar(36) NULL, \`owner_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_33afa95be605a69d9dc7de2811\` (\`content\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chat_rooms\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`owner_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_da0a82e8162f899dabdca23688\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`nick_name\` varchar(255) NOT NULL, \`joined_room_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_41151d5f469f3bf18cca2fda6f\` (\`nick_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_3c77641a9c908fa0ad4579ab911\` FOREIGN KEY (\`chatRoom_id\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_1668626956fd00acef4b93d2943\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` ADD CONSTRAINT \`FK_52c8dcc9f1ba9030439699e8b69\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_06d5da7f77d0da4ba66560eef6b\` FOREIGN KEY (\`joined_room_id\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_06d5da7f77d0da4ba66560eef6b\``);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` DROP FOREIGN KEY \`FK_52c8dcc9f1ba9030439699e8b69\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_1668626956fd00acef4b93d2943\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_3c77641a9c908fa0ad4579ab911\``);
        await queryRunner.query(`DROP INDEX \`IDX_41151d5f469f3bf18cca2fda6f\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_da0a82e8162f899dabdca23688\` ON \`chat_rooms\``);
        await queryRunner.query(`DROP TABLE \`chat_rooms\``);
        await queryRunner.query(`DROP INDEX \`IDX_33afa95be605a69d9dc7de2811\` ON \`messages\``);
        await queryRunner.query(`DROP TABLE \`messages\``);
    }

}
