import { test, expect } from '@playwright/test';

test.describe('Educational User Journey', () => {
  test('Basic page load and navigation', async ({ page }) => {
    // 1. Test Login Page Load
    await page.goto('/login');
    // Expect some login form element or text
    // Adjust selector based on actual login page content
    await expect(page.locator('body')).toBeVisible();
    
    // 2. Test Lab Page Load (Public access or fallback)
    await page.goto('/lab/experiment-1');
    
    // Check if the lab title loads containing the ID
    // Using a more generic locator to be safe
    await expect(page.getByText('Experiment Lab experiment-1')).toBeVisible();
    
    // Check for the "First, make your prediction" overlay which appears in prediction phase
    await expect(page.getByText('First, make your prediction')).toBeVisible();
  });
});