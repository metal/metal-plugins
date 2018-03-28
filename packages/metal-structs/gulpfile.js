'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'structs.css',
	bundleFileName: 'structs.js',
	moduleName: 'metal-structs',
	noSoy: true,
	testNodeSrc: [
		'env/test/node.js',
		'test/**/*.js'
	]
});
