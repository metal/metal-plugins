'use strict';

const karmaSauceLauncher = require('karma-sauce-launcher');

const karmaConfig = require('./karma.conf.js');

module.exports = function (config) {
    karmaConfig(config);

    const launchers = [
        {
            //batch Apple
            sl_safari_9: {
                base: 'SauceLabs',
                browserName: 'safari',
                platform: 'OS X 10.12',
                version: '10',
            },
            sl_safari_10: {
                base: 'SauceLabs',
                browserName: 'safari',
                platform: 'OS X 10.12',
                version: '10',
            },
        },
        
        {
            //batch Mozilla
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
            //batch Microsoft
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
        },
        
        {
            //batch Google
            sl_chrome: {
                base: 'SauceLabs',
                browserName: 'chrome',
            },
            sl_android_5: {
                base: 'SauceLabs',
                browserName: 'android',
                platform: 'Linux',
                version: '5.0',
            },
        }
    ];

    let batch = launchers[process.argv[4] | 0];

    let sauceLabsAccessKey = process.env.SAUCE_ACCESS_KEY;
    if (!sauceLabsAccessKey) {
        sauceLabsAccessKey = process.env.SAUCE_ACCESS_KEY_ENC;
        if (sauceLabsAccessKey) {
            sauceLabsAccessKey = new Buffer(sauceLabsAccessKey, 'base64').toString('binary');
        }
    }


    config.set({
        browsers: Object.keys(batch),

        browserDisconnectTimeout: 10000,
        browserDisconnectTolerance: 2,
        
        //mobile emulators in saucelabs are very slow
        browserNoActivityTimeout: 300000,
        captureTimeout: 300000,

        customLaunchers: batch,

        plugins: [
            'karma-chai',
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-sinon',
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
        }
    });
};