import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordField1778144960053 implements MigrationInterface {
    name = 'AddPasswordField1778144960053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`expences\` (\`id\` varchar(36) NOT NULL, \`amount\` int NOT NULL, \`note\` varchar(255) NOT NULL, \`usersId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(50) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`currency\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`unique_email\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`expences\` ADD CONSTRAINT \`FK_a91a7e7f02b20f79d797a05b7ae\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`expences\` DROP FOREIGN KEY \`FK_a91a7e7f02b20f79d797a05b7ae\``);
        await queryRunner.query(`DROP INDEX \`unique_email\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`expences\``);
    }

}
