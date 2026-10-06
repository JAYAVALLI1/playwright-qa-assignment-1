import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { username, password } from '../../utils/env';


test('User can login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);

    await expect(page).toHaveURL('https://demoqa.com/profile');
});
