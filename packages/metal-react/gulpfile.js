'use strict';

var metal = require('gulp-metal');

metal.registerTasks({
	bundleCssFileName: 'react.css',
	bundleFileName: 'react.js',
	moduleName: 'metal-react',
	noSoy: true
});
