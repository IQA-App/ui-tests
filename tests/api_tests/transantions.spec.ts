import { test, expect } from '@playwright/test';
import { API_URL_END_POINTS } from '../../apiData';
import { createCategoryRequest, createUserRequest } from '../../helpers/apiCall';
import { CATEGORY_NAME, TRANSACTION_NAME } from '../../testData';

test.describe('Transaction API Tests', () => {
    let token = '';
    const url = `${process.env.API_BASE_URL}`;
    let categoryId: 0;
    let randomN: 0;

    test('Create a transaction', async ({ request }) => {
        let response = await createUserRequest(request);
        let responseBody = await response.json();
        token = responseBody.access_token;
        console.log(token);

        let randomN = Math.floor(Math.random() * CATEGORY_NAME.length);
        responseBody = await createCategoryRequest(request, token, CATEGORY_NAME[randomN]);

        categoryId = responseBody.categoryId;
        console.log(categoryId);

        randomN = Math.floor(Math.random() * TRANSACTION_NAME.length);
        response = await request.post(`${url}${API_URL_END_POINTS.createTransaction}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                title: TRANSACTION_NAME[randomN],
                amount: 1000,
                type: 'expense',
                category: categoryId,
            },
        });

        expect(response.status()).toBe(201);
        responseBody = await response.json();
        console.log(responseBody);
    });
});
