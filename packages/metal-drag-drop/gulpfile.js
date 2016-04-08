'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'dragDrop.css',
	bundleFileName: 'dragDrop.js',
	globalName: 'metal',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'metal-drag-drop',
	noSoy: true
});
