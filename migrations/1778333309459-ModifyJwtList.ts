import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyJwtList1778333309459 implements MigrationInterface {
    name = 'ModifyJwtList1778333309459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jwt_list\` DROP FOREIGN KEY \`FK_7c2a0c8a4213feff8cc94e0a0c9\``);
        await queryRunner.query(`ALTER TABLE \`jwt_list\` ADD CONSTRAINT \`FK_7c2a0c8a4213feff8cc94e0a0c9\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jwt_list\` DROP FOREIGN KEY \`FK_7c2a0c8a4213feff8cc94e0a0c9\``);
        await queryRunner.query(`ALTER TABLE \`jwt_list\` ADD CONSTRAINT \`FK_7c2a0c8a4213feff8cc94e0a0c9\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
