const path = require('path');

module.exports = {
	entry: './index.js',
	output: {
		filename: 'incremental-dom-string.js',
		libraryTarget: 'commonjs',
		path: path.resolve('./lib/'),
	},
	module: {
		rules: [
			{
				include: __dirname,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},
};
