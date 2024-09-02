import { test, expect } from '@playwright/test';
import defineConfig from '../../playwright.config'

test.skip('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test.skip('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();

  await expect(process.env.test1).toEqual('abc');

});

test.skip("should check response status", async ({ request }) => {

  const response = await request.get(process.env.API_BASE_URL + '/api/user');
  //expect(response.ok()).toBeTruthy();
  console.log(JSON.stringify(response))
  expect(response["_initializer"].status).toBe(200)
});