import { test, expect } from '@playwright/test';
import { DB } from '../database/db';

const database = new DB();


const config = {
  user: process.env.DB_USER,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
  connectionTimeoutMillis: 30000,
};

test.only('Database connection test', async ({ }) => {
  const result = await database.executeQuery('SELECT 1;', config);
  console.log(result);
});


