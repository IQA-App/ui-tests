import { test, expect } from '@playwright/test';

test('Login test', async ({ page }) => {
  // Navigate to the login page
  await page.goto('https://yellow-pebble-0ff6c7d0f.5.azurestaticapps.net/');

});