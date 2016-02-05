'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'useragent.css',
	bundleFileName: 'useragent.js',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'metal-useragent'
});
