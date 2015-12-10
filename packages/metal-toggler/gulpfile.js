'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'toggler.css',
	bundleFileName: 'toggler.js',
	globalName: 'crystal',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'crystal-toggler'
});
