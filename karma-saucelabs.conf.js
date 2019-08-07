'use strict';

const karmaSauceLauncher = require('karma-sauce-launcher');

const karmaConfig = require('./karma.conf.js');

// Instances of browsers that specs will be splitted(sharded).
// More information here: https://github.com/rschuft/karma-sharding
// We cannot use sharding with Mocha.retries, so we are disabling it temporary.
function shard(browserList, instances) {
	return Array.apply(null, { length: instances * browserList.length })
		.map(function (e, i) { return browserList[i % browserList.length] });
};

module.exports = function(config) {
	karmaConfig(config);

	const launchers = [
		{
			// batch Apple
			// Tests in latest safari(11) are disabled. Check the following links:
			// https://stackoverflow.com/questions/47522080/selenium-webdriver-safari-11-0-typeerror-value-is-not-a-sequence?rq=1
			// https://github.com/karma-runner/karma-sauce-launcher/pull/149
			// sl_safari: {
			// 	base: 'SauceLabs',
			// 	browserName: 'safari',
			// 	platform: 'OS X 10.11',
			// },
			sl_safari_10: {
				base: 'SauceLabs',
				browserName: 'safari',
				platform: 'OS X 10.13',
				version: '12'
			},
		},

		{
			// batch Mozilla
			sl_firefox: {
				base: 'SauceLabs',
				browserName: 'firefox',
			},
			sl_firefox_53: {
				base: 'SauceLabs',
				browserName: 'firefox',
				version: '53',
			},
		},

		{
			// batch Microsoft
			sl_ie_11: {
				base: 'SauceLabs',
				browserName: 'internet explorer',
				platform: 'Windows 8.1',
				version: '11',
			},
			sl_edge: {
				base: 'SauceLabs',
				browserName: 'microsoftedge',
				platform: 'Windows 10',
			},
		},

		{
			// batch Google
			sl_chrome: {
				base: 'SauceLabs',
				browserName: 'chrome',
				platform: 'Windows 7',
			},
			sl_android: {
				base: 'SauceLabs',
				browserName: 'android',
				platform: 'Linux',
				version: '4.4',
			},
		},
	];

	let batch = launchers[process.argv[4] | 0];

	let sauceLabsAccessKey = process.env.SAUCE_ACCESS_KEY;
	if (!sauceLabsAccessKey) {
		sauceLabsAccessKey = process.env.SAUCE_ACCESS_KEY_ENC;
		if (sauceLabsAccessKey) {
			sauceLabsAccessKey = new Buffer(
				sauceLabsAccessKey,
				'base64'
			).toString('binary');
		}
	}

	config.set({
		browsers: Object.keys(batch),

		browserDisconnectTimeout: 10000,
		browserDisconnectTolerance: 2,

		// mobile emulators in saucelabs are very slow
		browserNoActivityTimeout: 300000,
		captureTimeout: 300000,

		customLaunchers: batch,

		plugins: [
			'karma-chai-sinon',
			'karma-mocha',
			'karma-webpack',
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
			testName: 'metal-plugins tests',
			tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
			username: process.env.SAUCE_USERNAME,
		},
	});
};
