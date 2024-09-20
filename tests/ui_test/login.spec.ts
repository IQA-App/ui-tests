import { test, expect } from '@playwright/test';

test('Login test', async ({ page }) => {
  // Navigate to the login page
  await page.goto('https://yellow-pebble-0ff6c7d0f.5.azurestaticapps.net/');

  // Fill in the username and password fields
  await page.fill('#username', 'your-username');
  await page.fill('#password', 'your-password');

  // Click the login button
  await page.click('#login-button');

  // Wait for navigation after login
  await page.waitForNavigation();

  // Verify that the login was successful
  // For example, check if a specific element is visible after login
  const userProfile = await page.isVisible('#user-profile');
  expect(userProfile).toBeTruthy();
});