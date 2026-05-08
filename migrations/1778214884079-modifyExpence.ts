import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyExpence1778214884079 implements MigrationInterface {
    name = 'ModifyExpence1778214884079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`expences\` ADD \`category\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`expences\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`expences\` ADD \`amount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`expences\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`expences\` ADD \`amount\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`expences\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`expences\` ADD \`amount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`expences\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`expences\` ADD \`amount\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`expences\` DROP COLUMN \`category\``);
    }

}
