'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'uri.css',
	bundleFileName: 'uri.js',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'metal-uri',
	testNodeSrc: [
		'env/test/node.js',
		'test/**/*.js'
	]
});
