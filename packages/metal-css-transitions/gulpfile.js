'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	buildSrc: 'example/*.js',
	bundleFileName: 'Example.js',
	moduleName: 'metal-css-transitions',
	noSoy: true
});