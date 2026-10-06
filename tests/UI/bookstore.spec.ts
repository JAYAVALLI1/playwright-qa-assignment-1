import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from '../../pages/LoginPage';
import { ProfilePage } from '../../pages/ProfilePage';
import { BookStorePage } from '../../pages/BookStorePage';
import { username, password } from '../../utils/env';

const BOOK_TITLE = 'Learning JavaScript Design Patterns';
const OUTPUT_FILE = path.resolve(__dirname, '../../output/book-details.txt');


test('User can search a book, save its details and logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);
    const bookStorePage = new BookStorePage(page);

    // Login via Home -> Book Store Application -> Login
    await loginPage.openLoginFromHome();
    await loginPage.login(username, password);
    await expect(page).toHaveURL('https://demoqa.com/profile');

    // Validate username and Logout button
    await expect(profilePage.getUsernameValue(username)).toBeVisible();
    await expect(profilePage.getLogoutButton()).toBeVisible();

    // Book Store: search and validate
    await profilePage.goToBookStore();
    await expect(page).toHaveURL(/\/books/);
    await bookStorePage.searchBook(BOOK_TITLE);
    await expect(bookStorePage.getBook(BOOK_TITLE)).toBeVisible();

    // Extract and save Title, Author, Publisher
    const details = await bookStorePage.getBookDetails(BOOK_TITLE);
    expect(details.title).toBe(BOOK_TITLE);
    expect(details.author).not.toBe('');
    expect(details.publisher).not.toBe('');

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(
        OUTPUT_FILE,
        `Title: ${details.title}\nAuthor: ${details.author}\nPublisher: ${details.publisher}\n`
    );

    // Logout (the Logout button lives on the profile page)
    await bookStorePage.goToProfile();
    await profilePage.logout();
    await expect(page).toHaveURL('https://demoqa.com/login');
    await expect(loginPage.getLoginButton()).toBeVisible();
});
