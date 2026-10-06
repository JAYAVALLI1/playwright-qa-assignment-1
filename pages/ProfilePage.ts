import { Page, Locator } from '@playwright/test';

export class ProfilePage {

    private usernameLabel: Locator;
    private logoutButton: Locator;
    private goToBookStoreButton: Locator;

    constructor(private page: Page) {
    
        this.usernameLabel = page.getByText('User Name :', { exact: true });

        this.logoutButton = page.getByRole('button', { name: 'Logout' });

        this.goToBookStoreButton = page.getByRole('button', { name: 'Go To Book Store' });
    }

    getUsernameLabel(): Locator {
        return this.usernameLabel;
    }

    getUsernameValue(username: string): Locator {
        return this.page.getByText(username, { exact: true });
    }

    getLogoutButton(): Locator {
        return this.logoutButton;
    }

    async goToBookStore(): Promise<void> {
        await this.goToBookStoreButton.click();
    }

    async logout(): Promise<void> {
        await this.logoutButton.click();
    }
}
