'use strict';

module.exports = function (config) {
	config.set({
		frameworks: ['browserify', 'mocha', 'chai', 'sinon', 'source-map-support'],

		files: [
			'test/**/*.js'
		],

		preprocessors: {
			'test/**/*.js': ['browserify']
		},

		browserify: {
			debug: true,
			transform: [
				require('browserify-istanbul')({
        	instrumenter: require('isparta')
      	}),
				'babelify'
			]
		},
    reporters: ['coverage', 'progress'],
    coverageReporter: {
			reporters: [
				{type: 'lcov', subdir: 'lcov'},
				{type: 'text-summary'}
			]
    },

		browsers: ['Chrome']
	});
};
