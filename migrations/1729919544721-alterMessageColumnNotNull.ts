import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterMessageColumnNotNull1729919544721 implements MigrationInterface {
    name = 'AlterMessageColumnNotNull1729919544721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_5bb8108b85199f4ae096599917f\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_830a3c1d92614d1495418c46736\``);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`chat_room_id\` \`chat_room_id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`user_id\` \`user_id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_5bb8108b85199f4ae096599917f\` FOREIGN KEY (\`chat_room_id\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_830a3c1d92614d1495418c46736\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_830a3c1d92614d1495418c46736\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_5bb8108b85199f4ae096599917f\``);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`user_id\` \`user_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`chat_room_id\` \`chat_room_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_830a3c1d92614d1495418c46736\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_5bb8108b85199f4ae096599917f\` FOREIGN KEY (\`chat_room_id\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
