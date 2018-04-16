const {Builder, By, Key, until} = require('selenium-webdriver');

describe('Selenium', () => {
  it('searches google for selenium', async () => {
    const driver = await new Builder().forBrowser('firefox').build();
    try {
      await driver.get('http://www.google.com/ncr');
      await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
      await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    } finally {
      await driver.quit();
    }
  });
});