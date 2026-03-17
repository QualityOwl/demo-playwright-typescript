import { test } from '../../common/fixture';
import { expect } from '@playwright/test';

const homePage = '/selenium-playground/';

test.beforeEach(async ({ page, log }) => {
    log.step(`Navigate to \'${homePage}\'.`);
    await page.goto(`${homePage}`);
});

test.afterEach(async ({ browser, testBase }) => {
    await testBase.Cleanup(browser);
});

test.describe('\'Checkbox Demo\' Page Tests', () => {
    test('Validate that single checkbox is checked', async ({ page, log }) => {
        const hyperlinkText = 'Checkbox Demo';

        log.step(`Click the \'${hyperlinkText}\' hyperlink.`);
        await page.getByRole('link', { name: hyperlinkText }).click();

        log.step(`Check the single checkbox`);        
        const checkbox = await page.getByRole('checkbox', { name: 'Click on check box' });
        await checkbox.check();

        log.step(`Validate that the checkbox is checked`);
        await expect(checkbox).toBeChecked();
    })
});