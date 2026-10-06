import { Page, Locator } from '@playwright/test';

export class LoginPage {

    private usernameInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;
    private bookStoreApplicationCard: Locator;
    private loginMenuLink: Locator;

    constructor(private page: Page) {
        this.usernameInput = page.locator('#userName');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login');

        // Home page card and the "Login" item of the Book Store Application side menu
        this.bookStoreApplicationCard = page.getByText('Book Store Application', { exact: true });
        this.loginMenuLink = page.getByRole('link', { name: 'Login' });
    }

  
    private async blockThirdPartyRequests(): Promise<void> {
        await this.page.route('**/*', route => {
            const { protocol, hostname } = new URL(route.request().url());
            const isAppHost = hostname === 'demoqa.com' || hostname.endsWith('.demoqa.com');
            return /^https?:$/.test(protocol) && !isAppHost ? route.abort() : route.continue();
        });
    }

    async goto(): Promise<void> {
        await this.blockThirdPartyRequests();

      
        await this.page.goto('https://demoqa.com/login', { waitUntil: 'commit' });
        await this.usernameInput.waitFor({ state: 'visible' });
    }

    async openLoginFromHome(): Promise<void> {
        await this.blockThirdPartyRequests();
        await this.page.goto('https://demoqa.com/', { waitUntil: 'domcontentloaded' });
        await this.bookStoreApplicationCard.click();
        await this.loginMenuLink.click();
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    getLoginButton(): Locator {
        return this.loginButton;
    }
}
