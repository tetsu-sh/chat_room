import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameMessageColumn1729860674413 implements MigrationInterface {
    name = 'RenameMessageColumn1729860674413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_1668626956fd00acef4b93d2943\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_3c77641a9c908fa0ad4579ab911\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`chatRoom_id\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`owner_id\``);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`chat_room_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`user_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_5bb8108b85199f4ae096599917f\` FOREIGN KEY (\`chat_room_id\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_830a3c1d92614d1495418c46736\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_830a3c1d92614d1495418c46736\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_5bb8108b85199f4ae096599917f\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`chat_room_id\``);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`owner_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`chatRoom_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_3c77641a9c908fa0ad4579ab911\` FOREIGN KEY (\`chatRoom_id\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_1668626956fd00acef4b93d2943\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
