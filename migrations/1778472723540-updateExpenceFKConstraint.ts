import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateExpenceFKConstraint1778472723540 implements MigrationInterface {
    name = 'UpdateExpenceFKConstraint1778472723540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`expences\` DROP FOREIGN KEY \`FK_a91a7e7f02b20f79d797a05b7ae\``);
        await queryRunner.query(`ALTER TABLE \`expences\` ADD CONSTRAINT \`FK_a91a7e7f02b20f79d797a05b7ae\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`expences\` DROP FOREIGN KEY \`FK_a91a7e7f02b20f79d797a05b7ae\``);
        await queryRunner.query(`ALTER TABLE \`expences\` ADD CONSTRAINT \`FK_a91a7e7f02b20f79d797a05b7ae\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
