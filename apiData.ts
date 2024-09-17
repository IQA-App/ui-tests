import { faker } from '@faker-js/faker';

export const getRandomEmail = () => {
    
    return faker.internet.email();
};

export const getRandomPassword = () => {
    let password = '';
    while (!/[0-9]/.test(password) || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[\W_]/.test(password)) {
        const randomLength = Math.floor(Math.random() * (20 - 6 + 1)) + 6;
        password = faker.internet.password({
            length: randomLength, 
            pattern: /[A-Za-z0-9_\W]/
        });
    }
    

    return password;
};
export const API_URL_END_POINTS = {
    categoryCreateEndPoint: '/category',
    userCreateEndPoint: '/user',
    userGetByIDEndPoint: '/auth/',
    userDeleteEndPoint: '/user/',
    userUpdateEndPoint: '/user/',
};

export const NEGATIVE_EMAIL_DATA_SET = [
    ['without @', 'test15.test.gmail'],
    ['without domain', 'test15@gmail'],
    ['space before email', ' test15@gmail.com'],
    ['space after domain', 'test15@gmail.com '],
    ['empty field', ''],
];

export const NEGATIVE_PASSWORD_DATA_SET = [
    ['Password less than 6 characters long', 'P1p!', 'Password must be at least 6 characters!'],
    [
        'Password longer than 20 characters long',
        'Password1!Password1!Password1!',
        'Password must be at most 20 characters long!',
    ],
    ['No digits in the password', 'Password!', 'Password must contains at least one digit!'],
    ['No special symbols in the password', 'Password1', 'Password must contain at least one special character!'],
    ['No lowercase letter in the password', 'PASSWORD1!', 'Password must contain at least one lowercase letter!'],
    ['No uppercase letter in the password', 'password1!', 'Password must contain at least one uppercase letter!'],
    ['Empty password field', '', 'Password must contains at least one digit!'],
];
