import { test } from '@common/fixture';
import { maps } from '@maps';
import { expect } from '@playwright/test';

const homePage = '/';

test.beforeEach(async ({ page, log }) => {
    log.step(`Navigate to \'${homePage}\'.`);
    await page.goto(`${homePage}`);
    await page.waitForLoadState('networkidle');
});

test.afterEach(async ({ browser, testBase }) => {
    await testBase.Cleanup(browser);
});

test.describe('\'Home\' Page', () => {

    test.describe('Format & Layout Tests', () => {

        test('Element layout is arranged correctly', async ({ page, log }) => {

            log.step('Compare displayed page to the baseline page');
            await expect(page).toHaveScreenshot('homepage-layout.png', {
                clip: { x: 0, y: 0, width: 1280, height: 450 },
                mask: [page.locator('.woocommerce-result-count')],
                maxDiffPixelRatio: 0.05
            });
        });
    });

    test.describe('Shopping Cart Tests', () => {

        test('Shopping cart dollar amount successfully updates', async ({ page, log }) => {
            const nameProductA = 'Falcon 9';
            const nameProductB = 'Saturn V';

            log.step(`Get displayed price for '${nameProductA}' product.`);
            const priceProductA = await maps.home.GetProductPrice(page, log, nameProductA);

            log.step(`Add \'${nameProductA}\' product to the shopping cart.`);
            await maps.home.ClickAddToCartButton(page, log, nameProductA);

            log.step(`Validate that the shopping cart dollar amount updated to ${priceProductA}`);
            let cartDollarTotal = await maps.home.GetCartDollarTotal(page, log);
            await expect(cartDollarTotal).toBe(priceProductA);

            log.step(`Get displayed price for '${nameProductB}' product.`);
            const priceProductB = await maps.home.GetProductPrice(page, log, nameProductB);

            log.step(`Add \'${nameProductB}\' product to the shopping cart.`);
            await maps.home.ClickAddToCartButton(page, log, nameProductB);
            
            log.step(`Validate that the shopping cart dollar amount updated to ${priceProductA + priceProductB}`);
            cartDollarTotal = await maps.home.GetCartDollarTotal(page, log);
            await expect(cartDollarTotal).toBe(priceProductA + priceProductB);
        });
    });

        test.describe('Shopping Cart Tests', () => {

        test('Shopping cart item amount successfully updates', async ({ page, log }) => {
            const nameProductA = 'Proton Rocket';
            const nameProductB = 'Falcon Heavy';

            log.step(`Add \'${nameProductA}\' product to the shopping cart.`);
            await maps.home.ClickAddToCartButton(page, log, nameProductA);

            log.step('Validate that the shopping cart item amount updated to 1');
            let cartItemTotal = await maps.home.GetCartItemTotal(page, log);
            await expect(cartItemTotal).toBe(1);

            log.step(`Add \'${nameProductB}\' product to the shopping cart.`);
            await maps.home.ClickAddToCartButton(page, log, nameProductB);
            
            log.step('Validate that the shopping cart dollar amount updated to 2');
            cartItemTotal = await maps.home.GetCartItemTotal(page, log);
            await expect(cartItemTotal).toBe(2);
        });
    });
});