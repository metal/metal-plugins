'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'storage.css',
	bundleFileName: 'storage.js',
	moduleName: 'metal-storage',
	noSoy: true,
	testNodeSrc: [
		'env/test/node.js',
		'test/**/*.js'
	]
});
