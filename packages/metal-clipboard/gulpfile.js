'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'clipboard.css',
	bundleFileName: 'clipboard.js',
	globalName: 'steel',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'steel-clipboard'
});
