import { Page, Locator } from '@playwright/test';

export interface BookDetails {
    title: string;
    author: string;
    publisher: string;
}

export class BookStorePage {

    private searchBox: Locator;
    private profileMenuLink: Locator;

    constructor(private page: Page) {
        this.searchBox = page.getByPlaceholder('Type to search');
        this.profileMenuLink = page.getByRole('link', { name: 'Profile' });
    }

    getSearchBox(): Locator {
        return this.searchBox;
    }

    async searchBook(title: string): Promise<void> {
        await this.searchBox.fill(title);
    }

    // The book title is rendered as a link inside the result row.
    getBook(title: string): Locator {
        return this.page.getByRole('link', { name: title, exact: true });
    }

    // Result row cells (verified in the live DOM): image | title | author | publisher
    async getBookDetails(title: string): Promise<BookDetails> {
        const row = this.page.getByRole('row').filter({ has: this.getBook(title) });
        const cells = row.getByRole('cell');

        return {
            title: (await cells.nth(1).innerText()).trim(),
            author: (await cells.nth(2).innerText()).trim(),
            publisher: (await cells.nth(3).innerText()).trim(),
        };
    }

    async goToProfile(): Promise<void> {
        await this.profileMenuLink.click();
    }
}
