'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'dragDrop.css',
	bundleFileName: 'dragDrop.js',
	globalName: 'crystal',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'crystal-drag-drop'
});
