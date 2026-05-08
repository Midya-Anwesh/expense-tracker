import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDateToExpence1778217772620 implements MigrationInterface {
    name = 'AddDateToExpence1778217772620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`expences\` CHANGE \`date\` \`date\` date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`expences\` CHANGE \`date\` \`date\` date NOT NULL`);
    }

}
