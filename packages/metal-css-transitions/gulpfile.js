'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	buildSrc: 'example/*.js',
	bundleFileName: 'App.js',
	moduleName: 'metal-css-transitions',
	noSoy: true
});