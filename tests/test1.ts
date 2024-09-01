import { test, expect } from '@playwright/test';

test.only('simple test', async ({ page }) => {
  await page.goto('https://example.com');
  const title = await page.title();
  expect(title).toBe('Example Domain');
});
