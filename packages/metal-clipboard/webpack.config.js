const webpack = require('webpack');

module.exports = {
	entry: './src/Clipboard.js',
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: {
				loader: 'babel-loader',
				options: {
					compact: false,
					presets: ['babel-preset-es2015']
				}
			}
		}]
	},
	output: {
		library: 'metal',
		libraryTarget: 'this',
		filename: './build/globals/clipboard.js'
	},
	plugins: [
		new webpack.optimize.ModuleConcatenationPlugin()
	]
};
