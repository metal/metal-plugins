'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'toggler.css',
	bundleFileName: 'toggler.js',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'metal-toggler'
});
