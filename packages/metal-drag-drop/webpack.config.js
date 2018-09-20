const webpack = require('webpack');

module.exports = {
	entry: './src/DragDrop.js',
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: {
				loader: 'babel-loader',
				options: {
					compact: false,
					presets: ['env'],
					plugins: ['babel-plugin-transform-node-env-inline']
				}
			}
		}]
	},
	output: {
		library: 'metal',
		libraryTarget: 'this',
		filename: './build/globals/dragDrop.js'
	},
	plugins: [
		new webpack.optimize.ModuleConcatenationPlugin()
	]
};
