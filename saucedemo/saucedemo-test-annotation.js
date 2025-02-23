const {
    Builder,
    By
} = require("selenium-webdriver");
const assert = require('assert');
const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const edge = require("selenium-webdriver/edge");
const browsers = [{
        name: "chrome",
        options: new chrome.Options().addArguments("--headless")
    },
    {
        name: "firefox",
        options: new firefox.Options().addArguments("--headless")
    },
    {
        name: "MicrosoftEdge",
        options: new edge.Options().addArguments("--headless")
    }
];

describe("saucedemo test - login and add to cart", function () {
    this.timeout(20000);

    for (let browser of browsers) {
        let driver;

        beforeEach(async function () {
            //membuat koneksi dengan browser
            driver = await new Builder()
                .forBrowser(browser.name)
                .setChromeOptions(browser.name === "chrome" ? browser.options : undefined)
                .setFirefoxOptions(browser.name === "firefox" ? browser.options : undefined)
                .setEdgeOptions(browser.name === "MicrosoftEdge" ? browser.options : undefined)
                .build();

            //mengakses website Saucedemo
            await driver.get("https://www.saucedemo.com/");
        });

        it("login success and add item to cart success", async function () {
            //menginputkan username dan password
            await driver.findElement(By.id('user-name')).sendKeys('standard_user');
            await driver.findElement(By.id('password')).sendKeys('secret_sauce');

            //klik tombol login
            await driver.findElement(By.id('login-button')).click();

            // validasi apakah sudah berhasil menampilkan halaman dashboard
            let titleText = await driver.findElement(By.css('.app_logo')).getText();
            assert.strictEqual(titleText.includes('Swag Lab'), true, "Title Does not include Swag Labs");

            // menambahkan produk ke keranjang
            await driver.findElement(By.id('add-to-cart-sauce-labs-backpack')).click();

            // melakukan validasi apakah produk berhasil ditambahkan ke keranjang
            let cart = await driver.findElement(By.css('.shopping_cart_badge'));
            assert.strictEqual(await cart.isDisplayed(), true, "You haven't selected a product yet");

            console.log(`Test login dan menambahkan item ke keranjang menggunakan ${browser.name} berhasil`);
        });

        it("login failed", async function () {
            //menginputkan username dan password
            await driver.findElement(By.id('user-name')).sendKeys('standard_user');
            await driver.findElement(By.id('password')).sendKeys('wrong-password');

            //klik tombol login
            await driver.findElement(By.id('login-button')).click();

            // validasi apakah sudah berhasil menampilkan halaman dashboard
            let errorText = await driver.findElement(By.css('.error-message-container')).getText();
            assert.strictEqual(errorText.includes('Username and password do not match any user in this service'), true, "Error massage not displayed properly");

            console.log(`Test login failed menggunakan ${browser.name} berhasil`);
        });

        afterEach(async function () {
            await driver.quit();
        });
    }
})

// saucedemoLogin();