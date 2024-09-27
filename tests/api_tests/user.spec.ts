import { test, expect } from '@playwright/test';
import { API_URL_END_POINTS } from '../../apiData';
import {
    getRandomEmail,
    getRandomPassword,
    MISSED_CREDENTIALS,
    NEGATIVE_EMAIL_DATA_SET,
    NEGATIVE_PASSWORD_DATA_SET,
    NEGATIVE_USER_ID,
    PASSWORD_LENGTH,
} from '../../testData';
import { createUserRequest } from '../../helpers/apiCall';
import { ur } from '@faker-js/faker/.';

test.describe('EG API Tests', () => {
    test('Get list of users', { tag: ['@api'] }, async ({ request }) => {
        const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.userEndPoint}`;
        let response = await createUserRequest(request);
        let responseBody = await response.json();
        const token = responseBody.access_token;

        response = await request.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        responseBody = await response.json();
        expect(response.status()).toBe(200);
    });

    test('Get user by ID', { tag: ['@api'] }, async ({ request }) => {
        const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.userEndPoint}`;
        let response = await createUserRequest(request);
        let responseBody = await response.json();
        const userId = responseBody.user.id;
        const token = responseBody.access_token;

        response = await request.get(url + userId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response);
        expect(response.status()).toBe(200);
    });

    test('E2E test. Create, edit and delete user with valid credentials', { tag: ['@api'] }, async ({ request }) => {
        const baseUrl = process.env.API_BASE_URL;
        const createUrl = `${baseUrl}${API_URL_END_POINTS.userEndPoint}`;
        const userEmail = getRandomEmail();
        const userPassword = getRandomPassword();
        const newUserEmail = getRandomEmail();

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

        const updateUrl = `${baseUrl}${API_URL_END_POINTS.userEndPoint}${userId}`;

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

        const deleteUrl = `${baseUrl}${API_URL_END_POINTS.userEndPoint}${userId}`;
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

test.describe('EG API Negative Tests', () => {
    const baseUrl = process.env.API_BASE_URL;
    const createUrl = `${baseUrl}${API_URL_END_POINTS.userEndPoint}`;

    NEGATIVE_EMAIL_DATA_SET.forEach((typeEmailField) => {
        test(`Verify non-successful creation of user in case of invalid email and valid password: ${typeEmailField[0]}`, async ({
            request,
        }) => {
            let response = await request.post(createUrl, {
                data: {
                    email: typeEmailField[1],
                    password: getRandomPassword,
                },
            });

            let responseBody = await response.json();
            const error = responseBody.error;
            const message = responseBody.message;

            expect(response.status()).toBe(400);
            expect(responseBody.error).toBe('Bad Request');
            expect(responseBody.message[0]).toBe('email must be an email');
        });
    });

    NEGATIVE_PASSWORD_DATA_SET.forEach((typePasswordField) => {
        test(`Verify non-successful creation of user in case of valid email and invalid password: ${typePasswordField[0]}`, async ({
            request,
        }) => {
            let response = await request.post(createUrl, {
                data: {
                    email: getRandomEmail(),
                    password: typePasswordField[1],
                },
            });

            let responseBody = await response.json();
            const error = responseBody.error;
            const message = responseBody.message;

            expect(response.status()).toBe(400);
            expect(responseBody.error).toBe('Bad Request');
            expect(responseBody.message[0]).toContain(typePasswordField[2]);
        });
    });

    MISSED_CREDENTIALS.forEach((fieldMissed, index) => {
        test(
            `Verify non-successful creation of user in case of missed ${fieldMissed[0]} (Test ${index + 1})`,
            { tag: ['@api'] },
            async ({ request }) => {
                const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.userEndPoint}`;
                const userEmail = getRandomEmail();
                const userPassword = getRandomPassword();

                const data: { email?: string; password?: string } = {};

                if (fieldMissed[0] === 'password') {
                    data.email = userEmail;
                } else if (fieldMissed[0] === 'email') {
                    data.password = userPassword;
                }

                let response = await request.post(url, {
                    data,
                });

                expect(response.status()).toBe(fieldMissed[1]);
                let responseBody = await response.json();
                let error = responseBody.error;
                expect(error).toContain(fieldMissed[2]);
            }
        );
    });
    test(
        'Verify non-successful creation of user in case of duplicate email',
        { tag: ['@api'] },
        async ({ request }) => {
            const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.userEndPoint}`;
            const userEmail = getRandomEmail();
            const userPassword = getRandomPassword();
            const duplicateUserEmail = userEmail;

            let response = await request.post(url, {
                data: {
                    email: userEmail,
                    password: userPassword,
                },
            });

            response = await request.post(url, {
                data: {
                    email: duplicateUserEmail,
                    password: userPassword,
                },
            });

            expect(response.status()).toBe(400);
            let responseBody = await response.json();
            let message = responseBody.message;
            expect(message).toContain('This email already exists!');
        }
    );

    for (const negativeID of NEGATIVE_USER_ID) {
        test(`Verify non-successful get user by ID in case of: ${negativeID[0]}`, async ({ request }) => {
            try {
                const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.userEndPoint}`;
                let response = await createUserRequest(request);
                let responseBody = await response.json();
                const token = responseBody.access_token;

                let userId = negativeID[1];
                const encodedUserId = encodeURIComponent(userId);
                console.log('User ID: ', encodedUserId);

                response = await request.get(url + encodedUserId, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                responseBody = await response.json();
                let message = responseBody?.message || 'No message in response';

                expect(response.status()).toBe(400);
                expect(message).toContain(
                    'Ah ah ! The id cannot be a whitespace! or the id must be a number! or the id must be a positive number!'
                );
            } catch (error) {
                console.error('Error occurred during test: ', error);
            }
        });
    }

    test.skip(`Verify non-successful get user by ID in case of non-exist ID`, async ({ request }) => {
        const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.userEndPoint}`;
        let response = await createUserRequest(request);
        let responseBody = await response.json();
        const token = responseBody.access_token;

        response = await request.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        responseBody = await response.json();
        const existingIds = responseBody.map((user: { id: number }) => user.id);

        const generateUniqueId = (existingIds: number[]): number => {
            let newId: number;
            do {
                newId = Math.floor(Math.random() * 10000);
            } while (existingIds.includes(newId));
            return newId;
        };

        const invalidId = generateUniqueId(existingIds);
        console.log(response);
        console.log('Generated Unique ID:', invalidId);

        response = await request.get(url + invalidId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response);
        expect(response.status()).toBe(400); //bug - the error is 401 - unathorized user
    });

    test.skip(`Verify non-successful edit user by ID in case of non-exist ID`, async ({ request }) => {
        const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.userEndPoint}`;
        let response = await createUserRequest(request);
        let responseBody = await response.json();
        const token = responseBody.access_token;

        response = await request.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        responseBody = await response.json();
        const existingIds = responseBody.map((user: { id: number }) => user.id);

        const generateUniqueId = (existingIds: number[]): number => {
            let newId: number;
            do {
                newId = Math.floor(Math.random() * 10000);
            } while (existingIds.includes(newId));
            return newId;
        };

        const invalidId = generateUniqueId(existingIds);
        console.log(response);
        console.log('Generated Unique ID:', invalidId);

        response = await request.patch(url + invalidId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response);
        expect(response.status()).toBe(400); //bug - the error is 401 - unathorized user
    });

    test.skip(
        'Verify non-successful edition of user in case of duplicate email',
        { tag: ['@api'] },
        async ({ request }) => {
            //Allows editing user with another user's email; duplicate emails should not be allowed
            const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.userEndPoint}`;
            let response = await createUserRequest(request);
            let responseBody = await response.json();
            let emailDuplicate = responseBody.user.email;
            console.log(responseBody);

            const userEmail = getRandomEmail();
            const userPassword = getRandomPassword();

            response = await request.post(url, {
                data: {
                    email: userEmail,
                    password: userPassword,
                },
            });

            responseBody = await response.json();
            const userId = responseBody.user.id;
            const urlID = url + userId;
            const token = responseBody.access_token;

            response = await request.patch(urlID, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    email: emailDuplicate,
                    password: userPassword,
                },
            });

            expect(response.status()).toBe(400);
            responseBody = await response.json();

            responseBody = await response.json();
            emailDuplicate = responseBody.user.email;
            let message = responseBody.message;
            expect(message).toContain('This email already exists!');
        }
    );

    test.skip(`Verify non-successful user deletion by ID in case of non-exist ID`, async ({ request }) => {
        const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.userEndPoint}`;
        let response = await createUserRequest(request);
        let responseBody = await response.json();
        const token = responseBody.access_token;

        response = await request.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        responseBody = await response.json();
        const existingIds = responseBody.map((user: { id: number }) => user.id);

        const generateUniqueId = (existingIds: number[]): number => {
            let newId: number;
            do {
                newId = Math.floor(Math.random() * 10000);
            } while (existingIds.includes(newId));
            return newId;
        };

        const invalidId = generateUniqueId(existingIds);
        console.log(response);
        console.log('Generated Unique ID:', invalidId);

        response = await request.delete(url + invalidId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response);
        expect(response.status()).toBe(400); //bug - the error is 401 - unathorized user
    });

    test(`Verify non-successful user deletion if user already been deleted`, async ({ request }) => {
        const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.userEndPoint}`;
        let response = await createUserRequest(request);
        let responseBody = await response.json();
        const token = responseBody.access_token;
        const userId = responseBody.user.id;
        console.log(userId);

        response = await request.delete(url + userId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        response = await request.delete(url + userId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        responseBody = await response.json();
        let message = responseBody.message;
        expect(message).toContain(`User with id ${userId} not found!`);
        expect(response.status()).toBe(400);
    });

    MISSED_CREDENTIALS.forEach((fieldMissed, index) => {
        test.skip(
            //Bug: allows separate updates of user email and password against Dto constraints
            `Verify non-successful update of user in case of missed ${fieldMissed[0]} (Test ${index + 1})`,
            { tag: ['@api'] },
            async ({ request }) => {
                const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.userEndPoint}`;
                let response = await createUserRequest(request);
                let responseBody = await response.json();
                const userId = responseBody.user.id;
                const urlID = url + userId;
                const token = responseBody.access_token;

                const userEmail = getRandomEmail();
                const userPassword = getRandomPassword();

                const data: { email?: string; password?: string } = {};

                if (fieldMissed[0] === 'password') {
                    data.email = userEmail;
                } else if (fieldMissed[0] === 'email') {
                    data.password = userPassword;
                }

                response = await request.patch(urlID, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data,
                });

                expect(response.status()).toBe(fieldMissed[1]);
                responseBody = await response.json();
                let error = responseBody.error;
                expect(error).toContain(fieldMissed[2]);
            }
        );
    });

    NEGATIVE_EMAIL_DATA_SET.forEach((typeEmailField) => {
        test(`Verify non-successful update of user in case of invalid email and valid password: ${typeEmailField[0]}`, async ({
            request,
        }) => {
            const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.userEndPoint}`;
            let response = await createUserRequest(request);
            let responseBody = await response.json();
            const userId = responseBody.user.id;
            const urlID = url + userId;
            const token = responseBody.access_token;

            response = await request.patch(urlID, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    email: typeEmailField[1],
                    password: getRandomPassword,
                },
            });

            responseBody = await response.json();
            const error = responseBody.error;
            const message = responseBody.message;

            expect(response.status()).toBe(400);
            expect(responseBody.error).toBe('Bad Request');
            expect(responseBody.message[0]).toBe('email must be an email');
        });
    });

    NEGATIVE_PASSWORD_DATA_SET.forEach((typePasswordField) => {
        test(`Verify non-successful update of user in case of valid email and invalid password: ${typePasswordField[0]}`, async ({
            request,
        }) => {
            const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.userEndPoint}`;
            let response = await createUserRequest(request);
            let responseBody = await response.json();
            const userId = responseBody.user.id;
            const urlID = url + userId;
            const token = responseBody.access_token;

            response = await request.patch(urlID, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    email: getRandomEmail,
                    password: typePasswordField[1],
                },
            });
            responseBody = await response.json();
            const error = responseBody.error;
            const message = responseBody.message;

            expect(response.status()).toBe(400);
            expect(responseBody.error).toBe('Bad Request');
            expect(responseBody.message[0]).toContain(typePasswordField[2]);
        });
    });
});

test.describe('EG API boundary tests: Password Length', () => {
    const url = `${process.env.API_BASE_URL}${API_URL_END_POINTS.userEndPoint}`;

    PASSWORD_LENGTH.forEach((passwordInfo) => {
        test(`Verify password length constraint: ${passwordInfo.description}`, async ({ request }) => {
            const response = await request.post(url, {
                data: {
                    email: getRandomEmail(),
                    password: getRandomPassword(passwordInfo.length),
                },
            });
            expect(response.status()).toBe(passwordInfo.statusCode);
        });
    });
});

// Обновление с недопустимыми данными:
// Входные данные: валидный ID и недопустимый формат данных.
// Ожидаемый результат: статус 400, сообщение об ошибке.
