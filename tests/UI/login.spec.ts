import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { username, password } from '../../utils/env';

/*
 * Given the user has a valid DemoQA account
 * When the user logs in with valid credentials
 * Then the user should be redirected to the profile page
 */
test('User can login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);

    await expect(page).toHaveURL('https://demoqa.com/profile');
});
