import { MigrationInterface, QueryRunner } from "typeorm";

export class ChatRoomAndMessageArchiveTable1729943966017 implements MigrationInterface {
    name = 'ChatRoomAndMessageArchiveTable1729943966017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`chat_room_arches\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`owner_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_306d3905b46165c6c4e30c3e47\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`message_arches\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`content\` varchar(255) NOT NULL, \`chat_room_id\` varchar(36) NOT NULL, \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`chat_room_arches\` ADD CONSTRAINT \`FK_dc49a1aeb9faa6be95450268fa9\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message_arches\` ADD CONSTRAINT \`FK_d2977b61e727de8e24a47b7eef3\` FOREIGN KEY (\`chat_room_id\`) REFERENCES \`chat_room_arches\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message_arches\` ADD CONSTRAINT \`FK_1f389126191110a9cfb5fe22192\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`message_arches\` DROP FOREIGN KEY \`FK_1f389126191110a9cfb5fe22192\``);
        await queryRunner.query(`ALTER TABLE \`message_arches\` DROP FOREIGN KEY \`FK_d2977b61e727de8e24a47b7eef3\``);
        await queryRunner.query(`ALTER TABLE \`chat_room_arches\` DROP FOREIGN KEY \`FK_dc49a1aeb9faa6be95450268fa9\``);
        await queryRunner.query(`DROP TABLE \`message_arches\``);
        await queryRunner.query(`DROP INDEX \`IDX_306d3905b46165c6c4e30c3e47\` ON \`chat_room_arches\``);
        await queryRunner.query(`DROP TABLE \`chat_room_arches\``);
    }

}
