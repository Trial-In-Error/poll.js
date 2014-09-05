var assert = require('assert'),
test = require('selenium-webdriver/testing'),
webdriver = require('selenium-webdriver');
var should = require('should');
var request = require('supertest');

test.describe('Google Search', function() {
	var driver = new webdriver.Builder().
	withCapabilities(webdriver.Capabilities.chrome()).
	build();

	test.it('should work', function() {
		driver.get('http://duckduckgo.com/');
		var searchBox = driver.findElement(webdriver.By.id('search_form_input_homepage'));
		searchBox.sendKeys('simple programmer');
		searchBox.getAttribute('value').then(function(value) {
			value.should.equal(value, 'simple programmer');
		});
	});

	test.it('should not work', function() {
		driver.get('http://duckduckgo.com/');
		var searchBox = driver.findElement(webdriver.By.id('search_form_input_homepage'));
		searchBox.sendKeys('simple programmers');
		searchBox.getAttribute('value').then(function(value) {
			value.should.not.equal('simple programmer');
		});
		driver.quit();
	})
});