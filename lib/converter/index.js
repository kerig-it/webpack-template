/*
 * This is a Markdown to HTML converter that is responsible for
 * compiling Markdown source code into distributed code that the
 * client can request and display immediately, without prior
 * parsing.
 *
 * Refer to the README in this repository's root for more
 * information.
*/

// Dependencies
const
	fs = require('fs'),
	meta = require('markdown-yaml-metadata-parser'),
	path = require('path'),
	showdown = require('showdown');

// Core converter
const converter = pathname => {
	// Read Markdown file.
	let markdown = fs.readFileSync(pathname).toString();

	// Generate HTML from Markdown
	let html = new showdown.Converter().makeHtml(
		meta(markdown).content
	);

	// Return generated template.
	return template(html);
};

// Generates HTML code from a template.
const template = html => {
	return fs.readFileSync(path.join(
		__dirname, 'template.html'
	)).toString().replace(/\{\{content\}\}/, html);
};

// Get metadata from Markdown.
const metadata = pathname => meta(
	fs.readFileSync(pathname).toString()
).metadata;

module.exports = {
	convert: converter,
	meta: metadata
};
