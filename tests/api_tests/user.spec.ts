import { test, expect } from '@playwright/test';
import { API_URL_END_POINTS } from '../../apiData';
import { EMAILUSER, PASSWORDUSER } from '../../testData';

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
        const userEmail = EMAILUSER;
        const userPassword = PASSWORDUSER.slice(0, 10);
        const newUserEmail = EMAILUSER.slice(3);

        let response = await request.post(createUrl, {
            data: {
                email: userEmail,
                password: userPassword,
            },
        });

        let responseBody = await response.json();
        const userId = responseBody.user.id;
        const token = responseBody.access_token;

        expect(response.status()).toBe(201);

        response = await request.get(`${baseUrl}/${userId}`);
        responseBody = await response.json();

        const updateUrl = `${baseUrl}${API_URL_END_POINTS.userUpdateEndPoint}${userId}`;

        response = await request.patch(updateUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                email: newUserEmail,
            },
        });

        expect(response.status()).toBe(200);

        const deleteUrl = `${baseUrl}${API_URL_END_POINTS.userUpdateEndPoint}${userId}`;
        response = await request.delete(deleteUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        expect(response.status()).toBe(200);
    });
});
