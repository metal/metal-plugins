const karmaConfig = require('./karma.conf.js');

module.exports = function (config) {
    karmaConfig(config);
    
    const preset = Object.assign(karmaConfig, {
        reporters: ['progress', 'coverage'],

        coverageReporter: {
            reporters: [
                {
                    type: 'lcov',
                    subdir: 'lcov',
                },
                {
                    type: 'text-summary',
                }
            ],
        },

        webpack: {
            mode: 'development',

            module: {
                rules: [{
                    test: /\.js$/,
                    exclude: /(node_modules)|(lib)|(build)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            compact: true,
                            comments: false,
                            presets: ['env'],
                            plugins: ['istanbul']
                        }
                    }
                }]
            }
        },

        plugins: [
            'karma-chai-sinon',
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-webpack',
            'karma-sharding'
        ],
    });
    
    config.set(preset);
}