import { test, expect } from '@playwright/test';

test.skip('should check response status', { tag: ['@api'] }, async ({ request }) => {
    const response = await request.get(process.env.API_BASE_URL + '/user');
    console.log(JSON.stringify(response));
    expect(response['_initializer'].status).toBe(200);
});
