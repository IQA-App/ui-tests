import { test, expect } from '@playwright/test';
import { API_URL_END_POINTS } from '../apiData';
import {
    getRandomEmail,
    getRandomPassword,
    NEGATIVE_EMAIL_DATA_SET,
    NEGATIVE_PASSWORD_DATA_SET,
    PASSWORD_LENGTH,
} from '../testData';

const createUserUrl = `${process.env.API_BASE_URL}${API_URL_END_POINTS.userEndPoint}`;
const createCategoryUrl = `${process.env.API_BASE_URL}${API_URL_END_POINTS.categoryEndPoint}`;
const userEmail = getRandomEmail();
const userPassword = getRandomPassword();
let token = '';
let userId = '';
let responseBody = '';

export async function createUserRequest(request) {
    const userEmail = getRandomEmail();
    const userPassword = getRandomPassword();
    try {
        let response = await request.post(createUserUrl, {
            data: {
                email: userEmail,
                password: userPassword,
            },
        });
        if (response.ok) {
            console.log(`User has been successfully created`);
            return response;
        } else {
            console.error(`Failed to create user: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error during create user request:', error);
    }
}

export async function createCategoryRequest(request, token, name) {
    try {
        let response = await request.post(createCategoryUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                title: name,
            },
        });
        if (response.ok) {
            let responseBody = await response.json();
            let categoryId = responseBody.id;
            console.log(`Category has been successfully created`);
            return {
                responseBody,
                categoryId,
            };
        } else {
            console.error(`Failed to create category: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error during category creation request:', error);
    }
}
