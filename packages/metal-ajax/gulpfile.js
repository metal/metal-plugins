'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'ajax.css',
	bundleFileName: 'ajax.js',
	globalName: 'metal',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'metal-ajax'
});
