'use strict';

const karmaSauceLauncher = require('karma-sauce-launcher');

const karmaConfig = require('./karma.conf.js');

module.exports = function(config) {
	karmaConfig(config);

	const launchers = {
		sl_chrome: {
			base: 'SauceLabs',
			browserName: 'chrome',
		},
		sl_safari_10: {
			base: 'SauceLabs',
			browserName: 'safari',
			platform: 'OS X 10.12',
			version: '10',
		},
		sl_firefox: {
			base: 'SauceLabs',
			browserName: 'firefox',
		},
		sl_firefox_53: {
			base: 'SauceLabs',
			browserName: 'firefox',
			version: '53',
		},
		sl_ie_11: {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			platform: 'Windows 8.1',
			version: '11',
		},
		sl_edge_15: {
			base: 'SauceLabs',
			browserName: 'microsoftedge',
			platform: 'Windows 10',
			version: '15',
		},
		sl_android_5: {
			base: 'SauceLabs',
			browserName: 'android',
			platform: 'Linux',
			version: '5.0',
		},
	};

	let sauceLabsAccessKey = process.env.SAUCE_ACCESS_KEY;
	if (!sauceLabsAccessKey) {
		sauceLabsAccessKey = process.env.SAUCE_ACCESS_KEY_ENC;
		if (sauceLabsAccessKey) {
			sauceLabsAccessKey = new Buffer(sauceLabsAccessKey, 'base64').toString('binary');
		}
	}

	config.set({
		browsers: Object.keys(launchers),

		browserDisconnectTimeout: 10000,
		browserDisconnectTolerance: 2,
		browserNoActivityTimeout: 240000,

		captureTimeout: 240000,

		customLaunchers: launchers,

		plugins: [
			'karma-chai',
			'karma-chrome-launcher',
			'karma-mocha',
			'karma-webpack',
			'karma-sinon',
			karmaSauceLauncher,
		],

		reporters: ['dots', 'saucelabs'],

		sauceLabs: {
			accessKey: sauceLabsAccessKey,
			connectOptions: {
				port: 4445,
				logfile: 'sauce_connect.log',
			},
			recordScreenshots: false,
			recordVideo: false,
			startConnect: false,
			testName: 'metal-debounce tests',
			tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
			username: process.env.SAUCE_USERNAME,
		},
	});
};