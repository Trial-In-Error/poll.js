var assert = require('assert'),
test = require('selenium-webdriver/testing'),
webdriver = require('selenium-webdriver');
 
test.describe('Google Search', function() {
  test.it('should work', function() {
  	this.timeout(5000);
    var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();
driver.get('http://216.239.32.20');
    var searchBox = driver.findElement(webdriver.By.name('q'));
    searchBox.sendKeys('simple programmer');
    searchBox.getAttribute('value').then(function(value) {
      assert.equal(value, 'simple programmer');
    });
    driver.quit();
  });
});