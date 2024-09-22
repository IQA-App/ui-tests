import * as dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

interface DBConfig {
    user: string;
    host: string;
    database: string;
    password: string;
    port: number;
}

export class DB {
    private pool: Pool;

    constructor(private config: DBConfig) {
        this.pool = new Pool(this.getPoolConfig());
    }

    private getPoolConfig() {
        return {
            user: this.config.user,
            host: this.config.host,
            database: this.config.database,
            password: this.config.password,
            port: this.config.port,
        };
    }

    async query(text: string, params?: any[]) {
        const res = await this.pool.query(text, params);
        return res;
    }

    async close() {
        await this.pool.end();
    }

    async executeQuery(query: string, params?: any[]) {
        try {
            const res = await this.pool.query(query, params);
            return res.rows; 
        } catch (error) {
            console.error('Query Execution Error:', error);
            throw error;
        }
    }
}