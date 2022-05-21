"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigMigration = void 0;
class ConfigMigration {
    async up(queryRunner) {
        await queryRunner.query(`
             INSERT INTO config (key,value) VALUES ('minTeam','50');
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
        
    `);
    }
}
exports.ConfigMigration = ConfigMigration;
//# sourceMappingURL=config.migration.js.map