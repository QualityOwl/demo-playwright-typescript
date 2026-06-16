import { expect, Locator, Page } from '@playwright/test';
import { Log } from '@common/log';

//#region Actions

export async function ClickAddToCartButton(page: Page, log: Log, productName: string) {
    log.step(`Click 'Add to cart' button for '${productName}' product.`);

    const productCard = await getProductCard(page, productName);
    const addToCartButton = productCard.getByText('Add to cart');
    await addToCartButton.scrollIntoViewIfNeeded();
    await addToCartButton.click();
    await WaitForAddToCartButtonLoaded(page, log, productName);
    await WaitForViewCartButton(page, log, productName);
}

//#endregion Actions

//#region Web Elements

export async function GetCartDollarTotal(page: Page, log: Log): Promise<number> {
    log.step('Get current cart total.');

    const cartDollarTotalLocator = page.locator('#site-header-cart .cart-contents span.woocommerce-Price-amount.amount');
    const cartDollarTotalText = await cartDollarTotalLocator.innerText();
    return parseFloat(parseFloat(cartDollarTotalText.replace(/[^0-9.-]/g, '')).toFixed(2));
}

export async function GetCartItemTotal(page: Page, log: Log): Promise<number> {
    log.step('');

    const cartItemTotalLocator = page.locator('#site-header-cart .cart-contents span.count');
    const cartItemTotalText = await cartItemTotalLocator.innerText();
    return parseInt(cartItemTotalText.replace(/ items?/, ''));
}

export async function GetProductPrice(page: Page, log: Log, productName: string): Promise<number> {
    log.step(`Get the displayed price for '${productName}' product.`);

    const productCard = await getProductCard(page, productName);
    const priceText = await productCard.locator('ins > span.woocommerce-Price-amount > bdi').innerText();
    return parseFloat(parseFloat(priceText.replace(/[^0-9.-]/g, '')).toFixed(2));
}

//#endregion Web Elements

//#region Helpers

async function getProductCard(page: Page, productName: string): Promise<Locator> {
    const matchingProductCard = page.locator('li.product').filter({
        has: page.locator('h2.woocommerce-loop-product__title', {
            hasText: `${productName}`
        })
    });

    const matchingCardCount = await matchingProductCard.count();

    if (matchingCardCount === 0) {
        throw new Error(`Product '${productName}' was not found.`);
    }

    if (matchingCardCount > 1) {
        throw new Error(`Multiple products matched '${productName}'.`);
    }

    return matchingProductCard;
}

async function WaitForViewCartButton(page: Page, log: Log, productName: string) {
    log.step(`Wait for 'View cart' button to be displayed for '${productName}' product.`);

    const productCard = await getProductCard(page, productName);
    const viewCartButton = productCard.locator('a.added_to_cart');
    await viewCartButton.waitFor({ state: 'visible' });
}

async function WaitForAddToCartButtonLoaded(page: Page, log: Log, productName: string) {
    log.step(`Wait for 'Add to cart' button to finish loading for '${productName}' product.`);

    const productCard = await getProductCard(page, productName);
    const addToCartButton = productCard.locator('a.add_to_cart_button');
    await expect(addToCartButton).not.toHaveClass(/loading/);
}

//#endregion Helpers