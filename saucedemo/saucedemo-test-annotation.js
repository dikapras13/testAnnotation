
// Import modul yang dibutuhkan
const {
    Builder,
    By
} = require("selenium-webdriver");
const assert = require('assert');
const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const edge = require("selenium-webdriver/edge");

//Array yang berisi konfigurasi browser
const browsers = [{
        name: "chrome",
        options: new chrome.Options().addArguments("--headless") // Menambahkan opsi untuk menjalankan Chrome dalam mode headless
    },
    {
        name: "firefox",
        options: new firefox.Options().addArguments("--headless") // Menambahkan opsi untuk menjalankan Firefox dalam mode headless
    },
    {
        name: "MicrosoftEdge",
        options: new edge.Options().addArguments("--headless") // Menambahkan opsi untuk menjalankan Microsoft Edge dalam mode headless
    }
];

describe("saucedemo test - login and add to cart", function () {
    this.timeout(20000); // Menetapkan batas waktu eksekusi test dalam 20 detik

    for (let browser of browsers) { // Looping untuk menjalankan test pada setiap browser yang dikonfigurasi
        let driver;

        beforeEach(async function () {
            // Membuat koneksi dengan webdriver yang akan digunakan
            driver = await new Builder()
                .forBrowser(browser.name)
                .setChromeOptions(browser.name === "chrome" ? browser.options : undefined)
                .setFirefoxOptions(browser.name === "firefox" ? browser.options : undefined)
                .setEdgeOptions(browser.name === "MicrosoftEdge" ? browser.options : undefined)
                .build();

            // Mengakses website Saucedemo
            await driver.get("https://www.saucedemo.com/");
        });

        it("login success and add item to cart success", async function () {
            // Menginputkan username dan password yang valid
            await driver.findElement(By.id('user-name')).sendKeys('standard_user');
            await driver.findElement(By.id('password')).sendKeys('secret_sauce');

            // Klik tombol login
            await driver.findElement(By.id('login-button')).click();

            // Validasi apakah berhasil masuk ke halaman dashboard
            let titleText = await driver.findElement(By.css('.app_logo')).getText();
            assert.strictEqual(titleText.includes('Swag Lab'), true, "Title Does not include Swag Labs");

            // Menambahkan produk ke keranjang belanja
            await driver.findElement(By.id('add-to-cart-sauce-labs-backpack')).click();

            // Validasi apakah produk berhasil ditambahkan ke keranjang
            let cart = await driver.findElement(By.css('.shopping_cart_badge'));
            assert.strictEqual(await cart.isDisplayed(), true, "You haven't selected a product yet");

            console.log(`Test login dan menambahkan item ke keranjang menggunakan ${browser.name} berhasil`);
        });

        it("login failed", async function () {
            // Menginputkan username dan password yang salah
            await driver.findElement(By.id('user-name')).sendKeys('standard_user');
            await driver.findElement(By.id('password')).sendKeys('wrong-password');

            // Klik tombol login
            await driver.findElement(By.id('login-button')).click();

            // Validasi apakah pesan error muncul
            let errorText = await driver.findElement(By.css('.error-message-container')).getText();
            assert.strictEqual(errorText.includes('Username and password do not match any user in this service'), true, "Error massage not displayed properly");

            console.log(`Test login failed menggunakan ${browser.name} berhasil`);
        });

        afterEach(async function () {
            await driver.quit(); // Menutup browser setelah setiap test selesai
        });
    }
})