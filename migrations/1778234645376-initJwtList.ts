import { MigrationInterface, QueryRunner } from "typeorm";

export class InitJwtList1778234645376 implements MigrationInterface {
    name = 'InitJwtList1778234645376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`jwt_list\` (\`id\` varchar(36) NOT NULL, \`token\` varchar(255) NOT NULL, \`blockListed\` tinyint NOT NULL, \`userId\` varchar(36) NULL, UNIQUE INDEX \`user_token_unique\` (\`userId\`, \`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`jwt_list\` ADD CONSTRAINT \`FK_7c2a0c8a4213feff8cc94e0a0c9\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jwt_list\` DROP FOREIGN KEY \`FK_7c2a0c8a4213feff8cc94e0a0c9\``);
        await queryRunner.query(`DROP INDEX \`user_token_unique\` ON \`jwt_list\``);
        await queryRunner.query(`DROP TABLE \`jwt_list\``);
    }

}
