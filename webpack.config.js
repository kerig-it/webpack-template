// Webpack configuration file.

// Modules
const
	fs = require('fs'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	path = require('path');

let config; // Configuration object --> ./config.json

try {
	config = JSON.parse(fs.readFileSync(
		path.join(__dirname, 'config.json')
	).toString());
}
catch (error) {
	throw error;
}

// Add your plugins in the below array, not in the actual export
// object.
let plugins = [
	// Default page
	new HtmlWebpackPlugin({
		filename: 'index.html',
		meta: { viewport: 'width=device-width, initial-scale=1.0' },
		template: './src/default.html',
		title: config.name
	})
];

fs.readdirSync(path.join(__dirname, 'src', 'pages')).forEach(file => {
	if (file.match(/\.x?html?/i)) {
		plugins.push(new HtmlWebpackPlugin({
			filename: `pages/${file}`,
			template: `./src/pages/${file}`
		}));
	}
});

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
	plugins: plugins
};
