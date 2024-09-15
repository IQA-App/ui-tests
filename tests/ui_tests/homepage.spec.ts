import { test, expect } from '@playwright/test'

test.only('Verify homepage URL', async ({ page }) => {
    await page.goto('https://yellow-pebble-0ff6c7d0f.5.azurestaticapps.net/')
    await expect(page).toHaveURL('https://yellow-pebble-0ff6c7d0f.5.azurestaticapps.net/')
})