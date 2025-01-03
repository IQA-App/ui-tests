import { test, expect } from '@playwright/test';
import { API_URL_END_POINTS } from '../../apiData';
import { createCategoryRequest, createUserRequest } from '../../helpers/apiCall';
import { CATEGORY_NAME, NEGATIVE_CATEGORY } from '../../testData';

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
        console.log(responseBody);
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

    test.skip('Get category by id', { tag: ['@api'] }, async ({ request }) => {
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

    test.skip('Update category', { tag: ['@api'] }, async ({ request }) => {
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

    test.skip('Delete category', { tag: ['@api'] }, async ({ request }) => {
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

test.describe('EG API Negative Tests Category', () => {
    let token = '';
    let categoryId: 0;
    const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.categoryEndPoint}`;

    test('Verify non-successful creation of category if not authorized', { tag: ['@api'] }, async ({ request }) => {
        let response = await request.post(url, {
            data: {
                title: CATEGORY_NAME[0],
            },
        });
        let responseBody = await response.json();
        expect(responseBody.message).toContain('Unauthorized');
        expect(response.status()).toBe(401);
    });

    test('Verify non-successful get of all categories if not authorized', { tag: ['@api'] }, async ({ request }) => {
        let response = await request.get(url);
        let responseBody = await response.json();
        expect(responseBody.message).toContain('Unauthorized');
        expect(response.status()).toBe(401);
    });

    test.skip('Verify non-successful get category by id if not authorized', { tag: ['@api'] }, async ({ request }) => {
        let response = await createUserRequest(request);
        let responseBody = await response.json();
        token = responseBody.access_token;

        responseBody = await createCategoryRequest(request, token, CATEGORY_NAME[0]);

        categoryId = responseBody.categoryId;
        response = await request.get(url + categoryId);
        responseBody = await response.json();
        expect(responseBody.message).toContain('Unauthorized');
        expect(response.status()).toBe(401);
    });

    test.skip('Verify non-successful update category if not authorized', { tag: ['@api'] }, async ({ request }) => {
        let response = await createUserRequest(request);
        let responseBody = await response.json();
        token = responseBody.access_token;

        responseBody = await createCategoryRequest(request, token, CATEGORY_NAME[0]);

        categoryId = responseBody.categoryId;

        response = await request.patch(url + categoryId);
        responseBody = await response.json();
        expect(responseBody.message).toContain('Unauthorized');
        expect(response.status()).toBe(401);
    });

    test.skip('Verify non-successful delete category if not authorized', { tag: ['@api'] }, async ({ request }) => {
        let response = await createUserRequest(request);
        let responseBody = await response.json();
        token = responseBody.access_token;

        responseBody = await createCategoryRequest(request, token, CATEGORY_NAME[0]);

        categoryId = responseBody.categoryId;
        response = await request.delete(url + categoryId);
        responseBody = await response.json();
        expect(responseBody.message).toContain('Unauthorized');
        expect(response.status()).toBe(401);
    });

    NEGATIVE_CATEGORY.forEach((typeCategoryField) => {
        test(`Verify non-successful creation of category if: ${typeCategoryField[0]}`, async ({ request }) => {
            let response = await createUserRequest(request);
            let responseBody = await response.json();
            token = responseBody.access_token;

            response = await request.post(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    title: typeCategoryField[1],
                },
            });
            responseBody = await response.json();
            console.log(responseBody);
            expect(responseBody.message).toContain(typeCategoryField[3]);
            expect(response.status()).toBe(typeCategoryField[2]);
        });
    });

    NEGATIVE_CATEGORY.forEach((typeCategoryField) => {
        test.skip(`Verify non-successful update of category if: ${typeCategoryField[0]}`, async ({ request }) => {
            let response = await createUserRequest(request);
            let responseBody = await response.json();
            let newName = typeCategoryField[1];
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
            responseBody = await response.json();
            expect(responseBody.message).toContain(typeCategoryField[3]);
            expect(response.status()).toBe(typeCategoryField[2]);
        });
    });
});
