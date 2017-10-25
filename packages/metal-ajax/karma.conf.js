'use strict';

module.exports = function(config) {
	config.set({
		frameworks: ['browserify', 'chai', 'mocha', 'sinon'],

		files: [
			{
				pattern: 'test/**/*.js',
				watched: false,
				included: true,
				served: true
			}
		],

		plugins: [
			'karma-browserify',
			'karma-chai',
			'karma-chrome-launcher',
			'karma-mocha',
			'karma-sinon'
		],

		preprocessors: {
			'test/**/*.js': ['browserify']
		},

		browsers: ['Chrome'],

		browserify: {
			debug: true,
			transform: [
				[
					'babelify',
					{
						presets: [
							'env'
						]
					}
				]
			]
		},

		client: {
			mocha: {
				timeout: 4000
			}
		},

		autoWatch: true
	});
};