import { beforeEach, afterEach } from 'node:test';
import { DB } from '../../database/db';

// Конфигурация подключения к базе данных
const dbConfig = {
  user: process.env.DB_USER || 'your_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'test_db',
  password: process.env.DB_PASSWORD || 'your_password',
  port: Number(process.env.DB_PORT) || 5432,
};

const db = new DB(dbConfig);

// Устанавливаем соединение перед всеми тестами
beforeAll(async () => {
  await db.executeQuery('SELECT NOW()'); // Пример запроса для проверки соединения
});

// Подготавливаем данные перед каждым тестом
beforeEach(async () => {
  await db.executeQuery(`
    INSERT INTO users (name, email) VALUES ('Test User', 'test@example.com');
  `);
});

// Очищаем данные после каждого теста
afterEach(async () => {
  await db.executeQuery('DELETE FROM users;');
});

// Завершаем соединение после всех тестов
afterAll(async () => {
  await db.executeQuery('SELECT NOW()'); // Пример запроса для завершения
});

function beforeAll(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}

function afterAll(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}

