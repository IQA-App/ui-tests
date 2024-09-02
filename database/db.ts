import * as dotenv from 'dotenv';
dotenv.config();

import { ConnectionPool, config as SQLConfig } from 'mssql';

interface DBConfig {
    user: string;
    host: string;
    database: string;
    password: string;
    port: number;
}

export class DB {
    constructor(private config: DBConfig) {}

    private getPoolConfig(): SQLConfig {
        return {
            user: this.config.user,
            server: this.config.host,
            database: this.config.database,
            password: this.config.password,
            port: this.config.port,
            options: {
                encrypt: true,
            },
        };
    }

    async executeQuery(query: string) {
        const poolConfig = this.getPoolConfig();
        const client = new ConnectionPool(poolConfig);

        try {
            await client.connect();
            const result = await client.request().query(query);
            console.log(result.recordset);
            return result.recordset;
        } catch (error) {
            console.error('Connection/Query Execution Error:', error);
            throw error;
        } finally {
            await client.close();
        }
    }
}
