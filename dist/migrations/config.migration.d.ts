import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class ConfigMigration implements MigrationInterface {
    name?: string;
    up(queryRunner: QueryRunner): Promise<any>;
    down(queryRunner: QueryRunner): Promise<any>;
}
