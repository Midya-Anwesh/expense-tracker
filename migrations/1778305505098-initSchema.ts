import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1778305505098 implements MigrationInterface {
    name = 'InitSchema1778305505098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`jwt_list\` (\`id\` varchar(36) NOT NULL, \`tokenIdentifier\` varchar(255) NOT NULL, \`blockListed\` tinyint NOT NULL DEFAULT 0, \`userId\` varchar(36) NULL, UNIQUE INDEX \`user_token_unique\` (\`userId\`, \`tokenIdentifier\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`expences\` (\`id\` varchar(36) NOT NULL, \`amount\` decimal NOT NULL, \`note\` varchar(255) NOT NULL, \`category\` varchar(255) NOT NULL, \`date\` date NOT NULL, \`usersId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(50) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`currency\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`unique_email\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`jwt_list\` ADD CONSTRAINT \`FK_7c2a0c8a4213feff8cc94e0a0c9\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`expences\` ADD CONSTRAINT \`FK_a91a7e7f02b20f79d797a05b7ae\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`expences\` DROP FOREIGN KEY \`FK_a91a7e7f02b20f79d797a05b7ae\``);
        await queryRunner.query(`ALTER TABLE \`jwt_list\` DROP FOREIGN KEY \`FK_7c2a0c8a4213feff8cc94e0a0c9\``);
        await queryRunner.query(`DROP INDEX \`unique_email\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`expences\``);
        await queryRunner.query(`DROP INDEX \`user_token_unique\` ON \`jwt_list\``);
        await queryRunner.query(`DROP TABLE \`jwt_list\``);
    }

}
