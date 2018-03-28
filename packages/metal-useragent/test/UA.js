'use strict';

import UA from '../src/UA';
import testAgents from './testAgents';

// Tests -----------------------------------------------------------------------

describe('UA', function() {
	beforeEach(function() {
		UA.globals.window = window;
	});

	it('should not throw error if testUserAgent is called without params', function() {
		UA.globals.window = {
			navigator: null
		};
		UA.testUserAgent();
		assert.notOk(UA.isChrome);
		assert.notOk(UA.isEdge);
		assert.notOk(UA.isFirefox);
		assert.notOk(UA.isIe);
		assert.notOk(UA.isIeOrEdge);
		assert.notOk(UA.isOpera);
		assert.notOk(UA.isSafari);
	});

	it('should not detect user agent when navigator is not present', function() {
		UA.globals.window = {
			navigator: null
		};
		UA.testUserAgent(UA.getNativeUserAgent(), UA.getNativePlatform());
		assert.notOk(UA.isChrome);
		assert.notOk(UA.isEdge);
		assert.notOk(UA.isFirefox);
		assert.notOk(UA.isIe);
		assert.notOk(UA.isIeOrEdge);
		assert.notOk(UA.isOpera);
		assert.notOk(UA.isSafari);
	});

	it('should not detect user agent when navigator.userAgent is not present', function() {
		UA.globals.window = {
			navigator: {
				userAgent: null
			}
		};
		UA.testUserAgent(UA.getNativeUserAgent(), UA.getNativePlatform());
		assert.notOk(UA.isChrome);
		assert.notOk(UA.isEdge);
		assert.notOk(UA.isFirefox);
		assert.notOk(UA.isIe);
		assert.notOk(UA.isIeOrEdge);
		assert.notOk(UA.isOpera);
		assert.notOk(UA.isSafari);
	});

	it('should detect chrome', function() {
		simulatesAndCheckEachUserAgentDetected([
			testAgents.CHROME_25,
			testAgents.CHROME_ANDROID,
			testAgents.CHROME_ANDROID_PHONE_4_4,
			testAgents.CHROME_ANDROID_TABLET,
			testAgents.CHROME_ANDROID_TABLET_4_4,
			testAgents.CHROME_IPAD,
			testAgents.CHROME_IPHONE,
			testAgents.CHROME_LINUX,
			testAgents.CHROME_LINUX_APPVERVERSION,
			testAgents.CHROME_MAC,
			testAgents.CHROME_OS,
			testAgents.CHROME_OS_910], ['isChrome']);
	});

	it('should detect edge', function() {
		simulatesAndCheckEachUserAgentDetected([
			testAgents.EDGE_12_0,
			testAgents.EDGE_12_9600], ['isEdge', 'isIeOrEdge']);
	});

	it('should detect firefox', function() {
		simulatesAndCheckEachUserAgentDetected([
			testAgents.FIREFOX_ANDROID_TABLET,
			testAgents.FIREFOX_19,
			testAgents.FIREFOX_LINUX,
			testAgents.FIREFOX_MAC,
			testAgents.FIREFOX_WINDOWS], ['isFirefox']);
	});

	it('should detect internet explorer', function() {
		simulatesAndCheckEachUserAgentDetected([
			testAgents.IE_10,
			testAgents.IE_10_COMPATIBILITY,
			testAgents.IE_10_MOBILE,
			testAgents.IE_11,
			testAgents.IE_11_COMPATIBILITY_MSIE_7,
			testAgents.IE_11_COMPATIBILITY_MSIE_9,
			testAgents.IE_11_COMPATIBILITY_MSIE_9,
			testAgents.IE_6,
			testAgents.IE_7,
			testAgents.IE_8,
			testAgents.IE_8_COMPATIBILITY,
			testAgents.IE_9,
			testAgents.IE_9_COMPATIBILITY], ['isIe', 'isIeOrEdge']);
	});

	it('should detect opera', function() {
		simulatesAndCheckEachUserAgentDetected([
			testAgents.OPERA_10,
			testAgents.OPERA_15,
			testAgents.OPERA_LINUX,
			testAgents.OPERA_MAC], ['isOpera']);
	});

	it('should detect safari', function() {
		simulatesAndCheckEachUserAgentDetected([
			testAgents.SAFARI_6,
			testAgents.SAFARI_IPHONE_32,
			testAgents.SAFARI_IPHONE_421,
			testAgents.SAFARI_IPHONE_431,
			testAgents.SAFARI_IPHONE_6,
			testAgents.SAFARI_IPOD,
			testAgents.SAFARI_MAC,
			testAgents.SAFARI_WINDOWS], ['isSafari']);
	});

	describe('Platform', function() {
		it('should not detect platform when navigator is not present', function() {
			UA.globals.window = {
				navigator: null,
				platform: null
			};
			UA.testUserAgent(UA.getNativeUserAgent(), UA.getNativePlatform());
			assert.notOk(UA.isMac);
			assert.notOk(UA.isWin);
		});

		it('should detect Mac', function() {
			UA.testUserAgent('', 'MacIntel');
			assert.ok(UA.isMac);
			assert.notOk(UA.isWin);
		});

		it('should detect Windows', function() {
			UA.testUserAgent('', 'Windows');
			assert.notOk(UA.isMac);
			assert.ok(UA.isWin);
		});
	});
});

// Helpers ---------------------------------------------------------------------

function simulatesAndCheckEachUserAgentDetected(simulateUserAgents, detectedUserAgents) {
	simulateUserAgents.forEach((simulateUserAgent) => {
		UA.testUserAgent(simulateUserAgent, '');
		checkEachUserAgentDetected(simulateUserAgent, detectedUserAgents);
	});
}

function checkEachUserAgentDetected(simulateUserAgents, detectedUserAgents) {
	['isChrome', 'isEdge', 'isFirefox', 'isIe', 'isIeOrEdge', 'isOpera', 'isSafari'].forEach((ua) => {
		if (detectedUserAgents.indexOf(ua) !== -1) {
			assert.ok(UA[ua], 'The user agent [' + simulateUserAgents + '] was not detected as [' + ua + ']');
		} else {
			assert.notOk(UA[ua], 'The user agent [' + simulateUserAgents + '] was detected as [' + ua + ']');
		}
	});
}
