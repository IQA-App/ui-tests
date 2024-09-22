import { before, beforeEach, afterEach, after } from 'node:test';
import { DB } from '../../database/db';

const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
};

const db = new DB(dbConfig);

before(async () => {
    await db.executeQuery('SELECT NOW()');
});

beforeEach(async () => {
    await db.executeQuery(`INSERT INTO users (name, email) VALUES ('Test User', 'test@example.com')`);
});

afterEach(async () => {
    await db.executeQuery('DELETE FROM users;');
});

after(async () => {
    await db.executeQuery('SELECT NOW()');
    await db.close();
});