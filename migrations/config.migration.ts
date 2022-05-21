
import {MigrationInterface, QueryRunner} from 'typeorm'

export class ConfigMigration implements MigrationInterface{
    name?: string;
    async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
             INSERT INTO config (key,value) VALUES ('minTeam','50');
        `)
    }
   async  down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        
    `)
    }

}