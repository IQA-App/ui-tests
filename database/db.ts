import * as dotenv from 'dotenv';
dotenv.config();

import { ConnectionPool } from 'mssql';

interface DBConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

export class DB {
  async executeQuery(query: string, config) {
    const client = new ConnectionPool(config);
    try {
      await client.connect();
      const result = await client.query(query);
      console.log(result.rows);
      return result.rows;
    } catch (error) {
      console.error("Ошибка подключения/выполнения запроса:", error);
      throw error;
    } finally {
      
      }
    }
  }


