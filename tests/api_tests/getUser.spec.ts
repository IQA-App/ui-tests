import { test, expect } from '@playwright/test';

test.skip('should check response status', { tag: ['@api'] }, async ({ request }) => {
    const response = await request.get(process.env.API_BASE_URL + '/user');
    console.log(JSON.stringify(response));
    expect(response['_initializer'].status).toBe(200);
});
test('Verify 401 Unauthorized response status', async ({request}) =>{
    const response = await request.get (process.env.API_BASE_URL + '/user')
    expect (response.status()).toBe(401)
    const responseMessage = await response.text()
    expect(responseMessage).toContain('Unauthorized')
})