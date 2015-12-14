'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'scrollspy.css',
	bundleFileName: 'scrollspy.js',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'metal-scrollspy'
});
