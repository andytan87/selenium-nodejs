const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
const util = require('util');
const fs = require('fs');

url = "http://commerce-site-env.eba-22rrestm.us-east-1.elasticbeanstalk.com/"

var assert = require('assert');

describe('tests', () => {

    let drivers = [];

    // Set up the WebDriver instances before running tests
    before(async function () {
        const browsers = [
            { name: 'Chrome', builder: new Builder().forBrowser('chrome') },
            { name: 'Firefox', builder: new Builder().forBrowser('firefox') }
        ];

        for (const browser of browsers) {
            const driver = await browser.builder.build();
            driver.name = browser.name;
            drivers.push(driver);
        }
    });

    // Clean up the WebDriver instances after running tests
    after(async function () {
        for (const driver of drivers) {
            await driver.quit();
        }
    });

    // Helper function to capture a screenshot
    async function captureScreenshot(driver, filename) {
        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync(driver.name + '-' + filename, screenshot, 'base64');
        console.log(`Screenshot captured: ${filename}`);
    }
    
    describe('#check if cart is empty', function() {
        it('the function should return -1 when the value is not present', async () => {
            // Running the same test for multiple browsers
            for (const driver of drivers) {
                console.log(`Running on ${driver.name}`);

                try {
                    await driver.get(url);
                    await driver.findElement(By.className('cart-icon')).click();
                    const findItem = await driver.findElement(By.xpath("//h3[contains(text(),'Your shopping bag is empty')]")).getText();

                    assert.equal('Your shopping bag is empty', findItem);
                } catch (error) {
                    console.log(error);
                    await captureScreenshot(driver, 'cart-exists.png');
                    throw error;
                }
                
            }
        });
    });
    
    describe('#check put item to cart)', function() {
        it('the function should return 0 when the value is present', async () => {
            for (const driver of drivers) {
                console.log(`Running on ${driver.name}`);

                try {
                    await driver.get(url);

                    await driver.findElement(By.className('product-card')).click()
                    await driver.sleep(1 * 1000)

                    await driver.findElement(By.className('add-to-cart')).click();
                    await driver.sleep(1 * 1000)

                    await driver.findElement(By.className('cart-icon')).click();
                    await driver.sleep(1 * 1000)

                    const findItem = await driver.findElement(By.xpath("//h5[contains(text(),'Speaker')]")).getText();

                    assert.equal('Speaker', findItem);
                } catch (error) {
                    console.log(error);
                    await captureScreenshot(driver, 'put-item-to-cart.png');
                    throw error;
                }
                
            }
        });
    });

    describe('#check remove item from cart', function() {


        it('the function should return 0 when the value is present', async () => {
            for (const driver of drivers) {
                console.log(`Running on ${driver.name}`);

                try {
                    await driver.get(url);

                    await driver.findElement(By.className('product-card')).click()
                    await driver.wait(until.elementLocated(By.className('add-to-cart')), 5000);

                    await driver.findElement(By.className('add-to-cart')).click();
                    await driver.wait(until.elementLocated(By.className('cart-icon')), 5000);

                    await driver.findElement(By.className('cart-icon')).click();
                    await driver.wait(until.elementLocated(By.className('remove-item')), 5000);

                    await driver.findElement(By.className('remove-item')).click();
                    await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(),'Your shopping bag is empty')]")), 5000);

                    const findItem = await driver.findElement(By.xpath("//h3[contains(text(),'Your shopping bag is empty')]")).getText();

                    assert.equal('Your shopping bag is empty', findItem);
                } catch (error) {
                    console.log(error);
                    await captureScreenshot(driver, 'remove-item-from-cart.png');
                    throw error;
                }
            }
        });
    });
    
   
  
});

