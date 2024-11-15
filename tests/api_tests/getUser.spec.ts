import { test, expect } from '@playwright/test';
import { API_URL_END_POINTS } from '../../apiData';

test.skip('should check response status', { tag: ['@api'] }, async ({ request }) => {
    const response = await request.get(process.env.API_BASE_URL + '/user');
    console.log(JSON.stringify(response));
    expect(response['_initializer'].status).toBe(200);
});
test('Negative test|  Verify unauthorized user is unable to retrieve all users', async ({ request }) => {
    const response = await request.get(process.env.API_BASE_URL + API_URL_END_POINTS.userEndPoint);
    expect(response.status()).toBe(401);

    const responseMessage = await response.text();
    expect(responseMessage).toContain('Unauthorized');
});
