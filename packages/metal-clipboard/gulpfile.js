'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'clipboard.css',
	bundleFileName: 'clipboard.js',
	globalName: 'metal',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'metal-clipboard'
});
