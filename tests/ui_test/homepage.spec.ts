    import { test, expect } from '@playwright/test';
    

    test('Verify homepage url and homepage content', async ({ page }) => {
        await page.goto(process.env.UI_BASE_URL);
        await expect(page).toHaveURL('https://app.westus2.cloudapp.azure.com');

        await expect(page.locator('h1.text-4xl.font-extrabold.text-white.mb-4')).toHaveText('Budget Tracker');
        await expect(page.locator('h1.text-4xl.font-extrabold.text-white.mb-4')).toBeVisible();
        await expect(page.locator('h1.text-4xl.font-extrabold.text-white.mb-4')).toHaveCSS('color', 'rgb(255, 255, 255)');

        await expect(page.locator('p.text-lg.text-white.text-center.max-w-lg.mb-8')).toHaveText('Keep track of your spending, manage your budget, and achieve your financial goals with ease.');
        await expect(page.locator('p.text-lg.text-white.text-center.max-w-lg.mb-8')).toBeVisible();
        await expect(page.locator('p.text-lg.text-white.text-center.max-w-lg.mb-8')).toHaveCSS('color', 'rgb(255, 255, 255)');
        
        await expect(page.getByRole('img', {name: 'Budget Icon'})).toBeVisible();
        
        await expect(page.getByRole('button', {name: 'Get Started'})).toBeVisible();
        await expect(page.locator('button.bg-blue-600')).toBeEnabled();
        await page.getByRole('button', {name: 'Get Started'}).click();
        await expect(page.locator('button.bg-blue-600')).toHaveText('Get Started');
        await expect(page.locator('button.bg-blue-600')).toHaveCSS('color', 'rgb(255, 255, 255)');
        await page.hover('button.bg-blue-600'); 
        await expect(page.locator('button.bg-blue-600')).toHaveCSS('background-color', 'rgb(59, 130, 246)');

        await expect(page.getByRole('button', {name: 'Learn More'})).toBeVisible();
        await expect(page.locator('button.bg-gray-600')).toBeEnabled();
        await page.getByRole('button', {name: 'Learn More'}).click();
        await expect(page.locator('button.bg-gray-600')).toHaveText('Learn More');
        await expect(page.locator('button.bg-gray-600')).toHaveCSS('color', 'rgb(255, 255, 255)');

        await expect(page.locator('a.py-2.text-white\\/50.hover\\:text-white.ml-auto.mr-10')).toBeVisible();
        await expect(page.locator('a.py-2.text-white\\/50.hover\\:text-white.ml-auto.mr-10')).toHaveAttribute('href', '/auth');
        await expect(page.locator('a.py-2.text-white\\/50.hover\\:text-white.ml-auto.mr-10')).toHaveText('Log In / Sign In');
    });
