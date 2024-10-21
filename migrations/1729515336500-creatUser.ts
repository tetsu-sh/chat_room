import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatUser1729515336500 implements MigrationInterface {
    name = 'CreatUser1729515336500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`nickName\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_f15a1d20dcbcde42b43563aaec\` (\`nickName\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_f15a1d20dcbcde42b43563aaec\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
