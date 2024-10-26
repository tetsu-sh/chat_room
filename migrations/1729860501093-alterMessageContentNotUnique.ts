import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterMessageContentNotUnique1729860501093 implements MigrationInterface {
    name = 'AlterMessageContentNotUnique1729860501093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_33afa95be605a69d9dc7de2811\` ON \`messages\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_33afa95be605a69d9dc7de2811\` ON \`messages\` (\`content\`)`);
    }

}
