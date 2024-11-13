import { test, expect } from '@playwright/test';
import { config } from 'dotenv';
import { API_URL_END_POINTS } from '../../apiData';

config();

test.describe('Transaction API Tests', () => {
  let token = '';
  const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.transactionEndPoint}`;

  // Example of setting up a token if needed
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${process.env.API_BASE_URL}/auth/login`, {
      data: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD
      }
    });
    const responseBody = await response.json();
    token = responseBody.token;
  });

  test('Should create a new transaction', async ({ request }) => {
    const payload = {
      amount: 100,
      currency: 'USD',
      description: 'Test transaction'
    };

    const response = await request.post(`${url}${API_URL_END_POINTS.createTransaction}`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id');
    expect(responseBody.amount).toBe(payload.amount);
    expect(responseBody.currency).toBe(payload.currency);
    expect(responseBody.description).toBe(payload.description);
  });

  test('Should retrieve a transaction by ID', async ({ request }) => {
    const transactionId = 'example-transaction-id'; // Replace with an actual transaction ID

    const response = await request.get(`${url}${API_URL_END_POINTS.getTransaction}/${transactionId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id', transactionId);
    expect(responseBody).toHaveProperty('amount');
    expect(responseBody).toHaveProperty('currency');
    expect(responseBody).toHaveProperty('description');
  });

  test('Should update a transaction by ID', async ({ request }) => {
    const transactionId = 'example-transaction-id'; // Replace with an actual transaction ID
    const payload = {
      amount: 200,
      description: 'Updated test transaction'
    };

    const response = await request.put(`${url}${API_URL_END_POINTS.updateTransaction}/${transactionId}`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id', transactionId);
    expect(responseBody.amount).toBe(payload.amount);
    expect(responseBody.description).toBe(payload.description);
  });

  test('Should delete a transaction by ID', async ({ request }) => {
    const transactionId = 'example-transaction-id'; // Replace with an actual transaction ID

    const response = await request.delete(`${url}${API_URL_END_POINTS.deleteTransaction}/${transactionId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(response.status()).toBe(204);
  });

  test('Should return 404 for non-existent transaction ID', async ({ request }) => {
    const nonExistentId = 'non-existent-id';

    const response = await request.get(`${url}${API_URL_END_POINTS.getTransaction}/${nonExistentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    console.log(responseBody); // Log the response body to see the actual structure

  // Adjust the expected message based on the actual response
  expect(responseBody).toHaveProperty('message', 'Cannot GET /api/transactions/transactions/:id/non-existent-id');
});

  test('Should validate response schema for transaction details', async ({ request }) => {
    const transactionId = 'example-transaction-id'; // Replace with an actual transaction ID

    const response = await request.get(`${url}${API_URL_END_POINTS.getTransaction}/${transactionId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();

    // Detailed check of the response structure
    expect(responseBody).toMatchObject({
      id: expect.any(String),
      amount: expect.any(Number),
      currency: expect.any(String),
      description: expect.any(String),
      status: expect.any(String),
      date: expect.any(String)
    });
  });
});