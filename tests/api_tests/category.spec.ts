import { test, expect } from '@playwright/test';
import { API_URL_END_POINTS } from '../../apiData';

test.describe('EG API Tests', () => {
    test('Create category', { tag: ['@api'] }, async ({ request }) => {
        const response = await request.post(process.env.API_BASE_URL + API_URL_END_POINTS.categoryCreateEndPoint);
        expect(response.statusText()).toBe('Created');
        expect(response.status()).toBe(201);
    });
});
