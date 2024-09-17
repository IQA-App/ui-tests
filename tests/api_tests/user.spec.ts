import { test, expect } from '@playwright/test';
import { API_URL_END_POINTS } from '../../apiData';
import { EMAILUSER, PASSWORDUSER } from '../../testData';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const requiredSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "email": {
        "type": "string",
        "format": "email",
      },
      "password": {
        "type": "string",
        "minLength": 6,
        "maxLength": 20,
        "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
        "description": "Password must be at least 6 characters long and no more than 20 characters long! Password must contain at least one digit and at least one lowercase letter and at least one uppercase letter!"
      }
    },
    "required": ["email", "password"]
  };

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

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(requiredSchema);

const validateData = (data: any) => {
  const valid = validate(data);
  if (!valid) {
    console.error("Validation failed:");
    console.error(validate.errors);
  }
  return {
    valid,
    errors: validate.errors
  };
};

const validData = [
  {
    email: "usar00123423432342@example.com",
    password: "ValidPass12!"
  },
  {
    email: "usar002342423422@example.com",
    password: "AnotherPass22!"
  }
];

const invalidData = [
  {
    email: "invalidemail",
    password: "short"
  },
  {
    email: "user@example.com",
    password: "missingdigit"
  },
  {
    email: "user003@example.com"
  }
];

test.describe('API Validation Tests with Ajv', () => {
    

  const baseUrl = process.env.API_BASE_URL;
  const createUrl = `${baseUrl}${API_URL_END_POINTS.userCreateEndPoint}`;

  test('Create user with valid data', async ({ request }) => {
    for (const data of validData) {

      const response = await request.post(createUrl, { data });
      const responseBody = await response.json();
      console.log(responseBody);

      expect(response.status()).toBe(201);

      const validation = validateData(responseBody);
     // expect(validation.valid).toBe(true);
    }
  });

  test('Create user with invalid data', async ({ request }) => {
    for (const data of invalidData) {
      const response = await request.post(createUrl, { data });

      expect(response.status()).toBe(400);
      const responseBody = await response.json();

      const validation = validateData(responseBody);
      expect(validation.valid).toBe(false);
    }
  });
})