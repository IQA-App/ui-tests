import { test, expect } from '@playwright/test';
import { DB } from '../../database/db';
import { getRandomEmail, getRandomPassword } from '../../testData';

const dbConfig = {
    user: process.env.DB_USER!,
    host: process.env.DB_HOST!,
    database: process.env.DB_NAME!,
    password: process.env.DB_PASSWORD!,
    port: parseInt(process.env.DB_PORT!),
};

const database = new DB(dbConfig);

test.describe('Database testing', { tag: ['@db'] }, () => {

    test('Verify there are users in DB', async () => {
        const result = await database.executeQuery('SELECT COUNT(*) AS userCount FROM "user" u;');
        const userCount = parseInt(result[0].usercount);
        console.log('Number of users in DB: ' + userCount);
        expect(userCount).toBeGreaterThan(0);
    });

    test.skip('Verify successfully added new user', async ({ page }) => {
        const userEmail = getRandomEmail();
        const userPassword = getRandomPassword();

        let query = `
            INSERT INTO "user" (email, password) VALUES ('${userEmail}', '${userPassword}') RETURNING id;`;
        
        let resultAdd: any;
        try {
            resultAdd = await database.executeQuery(query);
            console.log('New user is added successfully');
        } catch (error) {
            console.error('Error while adding new user:', error);
        }
    
        const userId = resultAdd[0]?.id;
    
        query = `SELECT * FROM "user" WHERE email = '${userEmail}';`;
        resultAdd = await database.executeQuery(query);
    
        expect(resultAdd.length).toBe(1);
        expect(resultAdd[0]?.email).toBe(userEmail);
    });

    test('Verify successfully updated user email', async () => {
        const userEmail = getRandomEmail();
        const userPassword = getRandomPassword();
        const newEmail = getRandomEmail();
        console.log(newEmail);

        let query = `
INSERT INTO "user" (email, password) VALUES ('${userEmail}', '${userPassword}') RETURNING id;`;
await database.executeQuery(query); 

        query = `
        UPDATE "user"
        SET email = '${newEmail}'
        WHERE email = '${userEmail}';
      `;
        await database.executeQuery(query);

        query = `select * from "user" where email = '${newEmail}';`;
        let result = await database.executeQuery(query);

        expect(result.length).toBe(1);
        expect(result[0]?.email).toBe(newEmail);
    });

     test('Verify successfully user deletion by email', async () => {
        const userEmail = getRandomEmail();
        const userPassword = getRandomPassword();
        const newEmail = getRandomEmail();

        let query = `
INSERT INTO "user" (email, password) VALUES ('${userEmail}', '${userPassword}') RETURNING id;`;
await database.executeQuery(query); 

query = `
      delete from "user" WHERE email = '${userEmail}';
    `;

        const result = await database.executeQuery(query);

        console.log(result);
         expect(result.length).toBe(0);
    });

    test('Verify successfully user deletion by id', async () => {
        const userEmail = getRandomEmail();
        const userPassword = getRandomPassword();
    
        let query = `
            INSERT INTO "user" (email, password) VALUES ('${userEmail}', '${userPassword}') RETURNING id;`;
        const result = await database.executeQuery(query);
        const userId = result[0]?.id; 
    
        query = `
            DELETE FROM "user" WHERE id = ${userId};`;
        await database.executeQuery(query);
    
        const checkQuery = `SELECT * FROM "user" WHERE id = ${userId};`;
        const checkResult = await database.executeQuery(checkQuery);
    
        expect(checkResult.length).toBe(0); 
    });
});
