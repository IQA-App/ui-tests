import { test, expect } from '@playwright/test';
import { DB } from '../../database/db';
import { EMAILUSER, PASSWORDUSER } from '../../testData';

const dbConfig = {
    user: process.env.DB_USER!,
    host: process.env.DB_HOST!,
    database: process.env.DB_NAME!,
    password: process.env.DB_PASSWORD!,
    port: parseInt(process.env.DB_PORT!, 10),
};

const database = new DB(dbConfig);

test.describe('Database testing', () => {
    test('Verify there are users in DB', async () => {
        const result = await database.executeQuery('SELECT COUNT(*) AS userCount FROM [user];');

        const userCount = result[0]?.userCount;
        expect(userCount).toBeGreaterThan(0);
        console.log('Number of users in DB: ' + userCount);
    });

    test('Verify successfully added new user', async ({ page }) => {
        const userEmail = EMAILUSER;
        const userPassword = PASSWORDUSER;
        let query = `
    INSERT INTO [user] (email, password)
    VALUES ('${userEmail}', '${userPassword}');
  `;

        try {
            const result = await database.executeQuery(query);
            console.log('New user is added successfully');
        } catch (error) {
            console.error('Error while adding new user:', error);
        }

        query = `select * from [user] where email = '${userEmail}';`;
        const result = await database.executeQuery(query);

        expect(result.length).toBe(1);
        expect(result[0]?.email).toBe(userEmail);
    });

    test('Verify successfully updated user email', async () => {
        const userEmail = EMAILUSER.substring(1);
        const userPassword = PASSWORDUSER;
        const newEmail = userEmail.substring(2);
        console.log(newEmail);

        let query = `
      INSERT INTO [user] (email, password)
      VALUES ('${userEmail}', '${userPassword}');
    `;
        let result = await database.executeQuery(query);

        const updateQuery = `
        UPDATE [user]
        SET email = '${newEmail}'
        WHERE email = '${userEmail}';
      `;
        result = await database.executeQuery(updateQuery);

        query = `select * from [user] where email = '${newEmail}';`;
        result = await database.executeQuery(query);

        expect(result.length).toBe(1);
        expect(result[0]?.email).toBe(newEmail);
    });
});