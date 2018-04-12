'use strict';

const lernaJson = require('./lerna.json');

module.exports = function (config) {
    config.set({
        browsers: ['Chrome'],

        frameworks: ['mocha', 'chai', 'sinon'],

        plugins: [
            'karma-chai',
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-sinon',
            'karma-webpack'
        ],

        preprocessors: {
            'packages/metal*/test/**/*.js': ['webpack']
        },

        webpack: {
            module: {
                rules: [{
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            compact: false,
                            presets: ['env']
                        }
                    }
                }]
            }
        },

        singleRun: true,

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
                pattern: 'packages/metal*/test/**/*.js',
                watched: false,
                included: true,
                served: true,
            }
        ],

        singleRun: true,
    });
};