'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'multimap.css',
	bundleFileName: 'MultiMap.js',
	globalName: 'metal',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'metal-multimap',
	testNodeSrc: [
		'env/test/node.js',
		'test/**/*.js'
	]
});
