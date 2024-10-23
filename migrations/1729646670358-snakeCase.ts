import { MigrationInterface, QueryRunner } from "typeorm";

export class SnakeCase1729646670358 implements MigrationInterface {
    name = 'SnakeCase1729646670358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`nick_name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_41151d5f469f3bf18cca2fda6f\` (\`nick_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chat_rooms\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`user_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_da0a82e8162f899dabdca23688\` (\`name\`), UNIQUE INDEX \`REL_e3b9a8a898a459cb91b2ee9735\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` ADD CONSTRAINT \`FK_e3b9a8a898a459cb91b2ee97350\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` DROP FOREIGN KEY \`FK_e3b9a8a898a459cb91b2ee97350\``);
        await queryRunner.query(`DROP INDEX \`REL_e3b9a8a898a459cb91b2ee9735\` ON \`chat_rooms\``);
        await queryRunner.query(`DROP INDEX \`IDX_da0a82e8162f899dabdca23688\` ON \`chat_rooms\``);
        await queryRunner.query(`DROP TABLE \`chat_rooms\``);
        await queryRunner.query(`DROP INDEX \`IDX_41151d5f469f3bf18cca2fda6f\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
