import { test, expect } from '@playwright/test';
import { DB } from '../../database/db';
import { getRandomEmail, getRandomPassword } from '../../testData';

const dbConfig = {
    user: process.env.DB_USER!,
    host: process.env.DB_HOST!,
    database: process.env.DB_NAME!,
    password: process.env.DB_PASSWORD!,
    port: parseInt(process.env.DB_PORT!, 10),
};

const database = new DB(dbConfig);

test.describe('Database testing', { tag: ['@db'] }, () => {
    let userId: number | undefined;
    const userEmail = getRandomEmail;
    test.skip('Verify there are users in DB', async () => {
        const result = await database.executeQuery('SELECT COUNT(*) AS userCount FROM [user];');
        const userCount = result[0]?.userCount;
        expect(userCount).toBeGreaterThan(0);
        console.log('Number of users in DB: ' + userCount);
    });

    test.skip('Verify successfully added new user', async ({ page }) => {
        const userEmail = getRandomEmail;
        const userPassword = getRandomPassword;
        let query = `
    INSERT INTO [user] (email, password)
    VALUES ('${userEmail}', '${userPassword}');
  `;
        let result: string | any[];
        try {
            result = await database.executeQuery(query);
            console.log('New user is added successfully');
        } catch (error) {
            console.error('Error while adding new user:', error);
        }
        userId = result[0].id;
        query = `select * from [user] where email = '${userEmail}';`;
        result = await database.executeQuery(query);
        expect(result.length).toBe(1);
        expect(result[0]?.email).toBe(userEmail);
    });

    test.skip('Verify successfully updated user email', async () => {
        const userEmail = getRandomEmail;
        const userPassword = getRandomPassword;
        const newEmail = getRandomEmail;
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

    test.skip('Verify successfully user deletion', async () => {
        let query = `
      delete from [user] WHERE id = '${userId}';
    `;

        const result = await database.executeQuery(query);

        console.log(result);
        //  expect(result.length).not.toBe(0);
    });
});
