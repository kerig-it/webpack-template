/*
 * This is the Webpack configuration file.
 *
 * Refer to the README in this repository's root for more
 * information.
*/

// Packages/libraries
const
	fs = require('fs'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	path = require('path');

const
	components = require(path.join(
		__dirname, 'lib', 'components'
	)),
	converter = require(path.join(
		__dirname, 'lib', 'converter'
	));

let config; // Configuration object --> ./config.json

try {
	config = JSON.parse(fs.readFileSync(
		path.join(__dirname, 'config.json')
	).toString());
}
catch (error) {
	throw error;
}

// Set the configuration object for the components handler.
components.set(config);

// Add your plugins in the below array, not in the actual export
// object.
let plugins = [];

// Object literal with regular expressions for relevant extensions
let exts = {
	html: /\.html?$/i,
	md: /\.m(ark)?d(own)?$/i
};

// Loop over all page files.
for (const file of fs.readdirSync(
	path.join(__dirname, 'src', 'pages')
)) {
	let
		content, ext, meta,
		// Path to target file
		pathname = path.join(__dirname, 'src', 'pages', file);

	// Are we dealing with Markdown?
	if (exts.md.test(file)) {
		// Convert Markdown to HTML.
		content = converter.convert(pathname);
		ext = 'md';
		meta = converter.meta(pathname);
	}
	else if (exts.html.test(file)) {
		content = fs.readFileSync(pathname).toString();
		ext = 'html';
	}

	if (content) {
		let base = fs.readFileSync(path.join(
			__dirname, 'src', 'default.html'
		)).toString();

		content = components.insert(
			base.replace('{{content}}', content), meta
		);

		let page = file.replace(exts[ext], '');

		plugins.push(new HtmlWebpackPlugin({
			filename: path.join(
				page === 'home' ? '' : page, 'index.html'
			),
			inject: 'body',
			meta: config.meta,
			templateContent: content,
			title: `${page} | ${config.name}`
		}));
	}
}

module.exports = {
	entry: './src/index.js',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [ 'style-loader', 'css-loader', 'sass-loader' ]
			},
			{ test: /\.((pn|jpe?|sv)g|[gt]if)$/i, type: 'asset/resource' },
			{ test: /\.((eo|[ot])tf?|woff2?)$/i, type: 'asset/resource' },
			{ test: /\.html?$/i, use: 'raw-loader' }
		]
	},
	output: {
		filename: 'bundle.js',
		hashFunction: 'xxhash64',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	plugins: plugins
};
