import { test, expect } from '@playwright/test';
import { getRandomEmail, getRandomPassword } from '../../testData';

test.skip('Valid login test', async ({ page }) => {
    await page.goto(process.env.UI_BASE_URL);
    await page.getByText('Log In / Sign In').click();
    await page.getByPlaceholder('Email').fill(getRandomEmail());
    await page.getByPlaceholder('Password').fill(getRandomPassword());
    await page.getByRole('button', { name: 'Submit' }).click();

    const accountCreatedMessage = await page.getByText('Account has been created');
    await expect(accountCreatedMessage).toBeVisible();
});
