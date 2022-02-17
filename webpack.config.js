// Webpack configuration file.

// Node modules
const
	fs = require('fs'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	path = require('path');

// Configuration variable
let config;

try {
	config = JSON.parse(fs.readFileSync(
		'config.json'
	).toString());
}
catch (error) {
	throw error;
}

module.exports = {
	entry: './src/index.js',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.s?[ac]ss$/i,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.((pn|jpe?|sv)g|[gpt]if)$/i,
				type: 'asset/resource'
			},
			{
				test: /\.((eo|[ot])tf?|woff2?)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.(x?html?)/i,
				use: 'raw-loader'
			}
		]
	},
	output: {
		filename: 'bundle.js',
		hashFunction: 'xxhash64',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [

		// Default
		new HtmlWebpackPlugin({
			filename: 'index.html',
			meta: {
				viewport: 'width=device-width, initial-scale=1.0'
			},
			template: './src/default.html',
			title: config.name
		}),

		// Home
		new HtmlWebpackPlugin({
			filename: 'pages/home.html',
			template: './src/pages/index.tmpl.html'
		})
	]
};
