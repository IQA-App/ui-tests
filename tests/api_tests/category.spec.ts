import { test, expect } from '@playwright/test';
import { API_URL_END_POINTS } from '../../apiData';
import { createCategoryRequest, createUserRequest } from '../../helpers/apiCall';
import * as exp from 'node:constants';
import { CATEGORY_NAME } from '../../testData';

test.describe('EG API Tests Category', () => {
    let token = '';
    let categoryId: 0;
    const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.categoryEndPoint}`;

    test('Create category', { tag: ['@api'] }, async ({ request }) => {
        let response = await createUserRequest(request);
        let responseBody = await response.json();
        token = responseBody.access_token;

        response = await request.post(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                title: CATEGORY_NAME[0],
            },
        });
        responseBody = await response.json();
        expect(response.status()).toBe(201);
    });

    test('Get all categories', { tag: ['@api'] }, async ({ request }) => {
        let response = await createUserRequest(request);
        let responseBody = await response.json();
        token = responseBody.access_token;

        for (const category of CATEGORY_NAME) {
            response = await createCategoryRequest(request, token, category);
        }

        response = await request.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        responseBody = await response.json();

        const allIds = responseBody.map((category) => category.id);
        console.log(allIds);

        const categoryId = allIds[0];
        console.log(allIds[0]);

        expect(response.status()).toBe(200);
    });

    test('Get category by id', { tag: ['@api'] }, async ({ request }) => {
        let response = await createUserRequest(request);
        let responseBody = await response.json();
        token = responseBody.access_token;

        responseBody = await createCategoryRequest(request, token, CATEGORY_NAME[0]);

        categoryId = responseBody.categoryId;

        response = await request.get(url + categoryId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        responseBody = await response.json();

        expect(response.status()).toBe(200);
        expect(responseBody.id).toBe(categoryId);
    });

    test('Update category', { tag: ['@api'] }, async ({ request }) => {
        let response = await createUserRequest(request);
        let responseBody = await response.json();
        let newName = CATEGORY_NAME[1];
        token = responseBody.access_token;

        responseBody = await createCategoryRequest(request, token, CATEGORY_NAME[0]);

        categoryId = responseBody.categoryId;

        response = await request.patch(url + categoryId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                title: newName,
            },
        });
        responseBody = await response.text();
        console.log(responseBody);
        expect(response.status()).toBe(200);
        expect(responseBody).toContain(categoryId + ' updated');
    });

    test('Delete category', { tag: ['@api'] }, async ({ request }) => {
        let response = await createUserRequest(request);
        let responseBody = await response.json();
        token = responseBody.access_token;

        responseBody = await createCategoryRequest(request, token, CATEGORY_NAME[0]);

        categoryId = responseBody.categoryId;

        response = await request.delete(url + categoryId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        responseBody = await response.text();
        console.log(responseBody);
        expect(response.status()).toBe(200);
        expect(responseBody).toContain(categoryId + ' deleted');
    });
});
