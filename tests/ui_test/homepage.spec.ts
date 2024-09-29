import { test, expect } from '@playwright/test';

test('Verify homepage URL', async ({ page }) => {
    await page.goto(process.env.UI_BASE_URL);
    await expect(page).toHaveURL('https://app.westus2.cloudapp.azure.com');

    const homeText = page.locator('text=Home');
    await expect(homeText).toBeVisible();
});
