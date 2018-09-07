'use strict';

const lernaJson = require('./lerna.json');
const webpack = require('webpack');
let performance = String(process.env.PERFORMANCE) !== 'false';

let localLaunchers = {
    ChromeNoSandboxHeadless: {
        base: 'Chrome',
        flags: [
            '--no-sandbox',
            '--headless',
            '--disable-gpu',
            // Without a remote debugging port, Google Chrome exits immediately.
            '--remote-debugging-port=9333'
        ]
    },
};

// Instances of browsers that specs will be splitted(sharded).
// More information here: https://github.com/rschuft/karma-sharding
// We cannot use sharding with Mocha.retries, so we are disabling it temporary.
function shard(browserList, instances) {
    return Array.apply(null, { length: instances * browserList.length })
        .map(function (e, i) { return browserList[i % browserList.length] });
};

if (!process.env.CHROME_BIN) {
    process.env.CHROME_BIN = require('puppeteer').executablePath();
}

module.exports = function (config) {
    config.set({
        browsers: [Object.keys(localLaunchers)],

        customLaunchers: localLaunchers,

        customHeaders: [{
            match: './packages/metal-ajax/test/data/data.json',
            name: 'Content-Length',
            value: 315186
        }],

        frameworks: ['mocha', 'chai-sinon'],

        plugins: [
            'karma-chai-sinon',
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-webpack',
        ],

        preprocessors: {
            'packages/*/test/**/*.js': ['webpack']
        },

        webpack: {
            mode: 'development',

            module: {
                rules: [{
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            compact: true,
                            comments: false,
                            presets: ['@babel/preset-env']
                        }
                    }
                }]
            },

            plugins: [
                new webpack.DefinePlugin({
                    DISABLE_FLAKEY: !!String(process.env.FLAKEY).match(/^(0|false)$/gi),
                    ENABLE_PERFORMANCE: performance
                }),
            ],

            performance: {
                hints: false
            }
        },

        webpackMiddleware: {
            logLevel: 'error',
            stats: 'errors-only'
        },

        singleRun: true,

		browserLogOptions: { terminal: true },
		browserConsoleLogOptions: { terminal: true },

        browserNoActivityTimeout: 5 * 60 * 1000,

        client: {
            mocha: {
                timeout: 4000,
            },
        },

        exclude: ['packages/metal-promise/**/*.js'],

        files: [
            // Since all files will be added, we need to ensure manually that these
            // will be added first.
            {
                pattern: 'packages/*/test/**/*.js',
                watched: false,
                included: true,
                served: true,
            },

            {
                pattern: 'packages/metal-ajax/test/data/data.json',
                watched: false,
                included: false,
                served: true
            }
        ],

        singleRun: true,
    });
};