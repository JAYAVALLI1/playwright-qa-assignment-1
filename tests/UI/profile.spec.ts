import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProfilePage } from '../../pages/ProfilePage';
import { username, password } from '../../utils/env';

/*
 * Given the user has a valid DemoQA account
 * When the user logs in with valid credentials
 * Then the user should be redirected to the profile page
 * And the username should be displayed
 * And the Logout button should be visible
 */
test('User can login and validate profile page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);

    await loginPage.goto();
    await loginPage.login(username, password);

    await expect(page).toHaveURL('https://demoqa.com/profile');

    // Validate username
    await expect(profilePage.getUsernameLabel()).toBeVisible();
    await expect(profilePage.getUsernameValue(username)).toBeVisible();

    // Validate Logout button
    await expect(profilePage.getLogoutButton()).toBeVisible();
});
