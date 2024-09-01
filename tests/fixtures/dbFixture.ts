import { beforeEach, afterEach } from 'node:test';
import { DB } from '../../database/db';

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
};

const db = new DB();

beforeAll(async () => {
  await db.executeQuery('SELECT NOW()',dbConfig);
});

beforeEach(async () => {
  await db.executeQuery(`INSERT INTO users (name, email) VALUES ('Test User', 'test@example.com')`, dbConfig);
});

afterEach(async () => {
  await db.executeQuery('DELETE FROM users;',dbConfig);
});

afterAll(async () => {
  await db.executeQuery('SELECT NOW()',dbConfig); 
});

function beforeAll(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}

function afterAll(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}

