import { test, expect } from '@playwright/test';
import { API_URL_END_POINTS, getRandomEmail, getRandomPassword, NEGATIVE_EMAIL_DATA_SET, NEGATIVE_PASSWORD_DATA_SET } from '../../apiData';

test.describe('EG API Tests', () => {

    test('Get list of users', { tag: ['@api'] }, async ({ request }) => {
        const response = await request.get(process.env.API_BASE_URL + '/user');
        const responseBody = await response.json();
        expect(response.status()).toBe(200);
    });

    test('Get user by ID', { tag: ['@api'] }, async ({ request }) => {
        let response = await request.get(process.env.API_BASE_URL + '/user');
        const responseBody = await response.json();
        const firstUserId = responseBody[0].id;
        response = await request.get(process.env.API_BASE_URL + '/user/' + firstUserId);
        expect(response.status()).toBe(200);
    });

    test('E2E test. Create, update and delete user with valid credentials', { tag: ['@api'] }, async ({ request }) => {
        const baseUrl = process.env.API_BASE_URL;
        const createUrl = `${baseUrl}${API_URL_END_POINTS.userCreateEndPoint}`;
        const userEmail = getRandomEmail();
        const userPassword = getRandomPassword();
        const newUserEmail = getRandomEmail();

        let response = await request.post(createUrl, {
            data: {
                email: userEmail,
                password: userPassword,
            },
        });

        let responseBody = await response.json();
        console.log(responseBody);

        const userId = responseBody.user.id;
        const token = responseBody.access_token;

        expect(responseBody.user.email).toBe(userEmail);
        expect(response.status()).toBe(201);        

        const updateUrl = `${baseUrl}${API_URL_END_POINTS.userUpdateEndPoint}${userId}`;

        response = await request.patch(updateUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                email: newUserEmail,
            },
        });

        responseBody = await response.json();
        expect(responseBody.email).toBe(newUserEmail);
        expect(response.status()).toBe(200);

        const deleteUrl = `${baseUrl}${API_URL_END_POINTS.userUpdateEndPoint}${userId}`;
        response = await request.delete(deleteUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        responseBody = await response.json();

        expect(responseBody.message).toBe(`The user with id:${userId} deleted`);
        expect(response.status()).toBe(200);
    });
});


test.describe('EG API Negative Tests', () => {
    const baseUrl = process.env.API_BASE_URL;
    const createUrl = `${baseUrl}${API_URL_END_POINTS.userCreateEndPoint}`;

    NEGATIVE_EMAIL_DATA_SET.forEach((typeEmailField) => {
        test(`Verify non-successful creation of user in case of invalid email and valid password: ${typeEmailField[0]}`, async ({ request }) => {
        const userPassword = getRandomPassword();

        let response = await request.post(createUrl, {
            data: {
                email: typeEmailField[1],
                password: getRandomPassword,
            },
        });

        let responseBody = await response.json();
        const error = responseBody.error;
        const message = responseBody.message;

        expect(response.status()).toBe(400);
        expect(responseBody.error).toBe('Bad Request');
        expect(responseBody.message[0]).toBe("email must be an email");
    });
});

NEGATIVE_PASSWORD_DATA_SET.forEach((typePasswordField) => {
    test(`Verify non-successful creation of user if: ${typePasswordField[0]}`, async ({ request }) => {
    const userEmail = getRandomEmail;

    let response = await request.post(createUrl, {
        data: {
            email: getRandomEmail(),
            password: typePasswordField[1],
        },
    });

    let responseBody = await response.json();
    const error = responseBody.error;
    const message = responseBody.message;

    expect(response.status()).toBe(400);
    expect(responseBody.error).toBe('Bad Request');
    expect(responseBody.message[0]).toContain(typePasswordField[2]);
});
});
})


