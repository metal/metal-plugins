'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'scrollspy.css',
	bundleFileName: 'scrollspy.js',
	globalName: 'crystal',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'crystal-scrollspy'
});
