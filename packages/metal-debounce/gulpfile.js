'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'debounce.css',
	bundleFileName: 'debounce.js',
	globalName: 'metal',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'metal-debounce',
	testNodeSrc: [
		'env/test/node.js',
		'test/**/*.js'
	]
});
