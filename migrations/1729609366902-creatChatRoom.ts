import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatChatRoom1729609366902 implements MigrationInterface {
    name = 'CreatChatRoom1729609366902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`chat_room\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`userId\` varchar(36) NULL, UNIQUE INDEX \`IDX_9ef6ce8864fa24adf15554a3a1\` (\`name\`), UNIQUE INDEX \`REL_e5e156f315f06303c004402b8c\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`chat_room\` ADD CONSTRAINT \`FK_e5e156f315f06303c004402b8cb\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chat_room\` DROP FOREIGN KEY \`FK_e5e156f315f06303c004402b8cb\``);
        await queryRunner.query(`DROP INDEX \`REL_e5e156f315f06303c004402b8c\` ON \`chat_room\``);
        await queryRunner.query(`DROP INDEX \`IDX_9ef6ce8864fa24adf15554a3a1\` ON \`chat_room\``);
        await queryRunner.query(`DROP TABLE \`chat_room\``);
    }

}
