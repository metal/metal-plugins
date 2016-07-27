'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'pathParser.css',
	bundleFileName: 'pathParser.js',
	moduleName: 'metal-path-parser',
	noSoy: true,
	testNodeSrc: [
		'env/test/node.js',
		'test/**/*.js'
	]
});
