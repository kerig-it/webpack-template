/*
 * This is a components handler that can insert certain page
 * components such as headers, footers into an HTML template.
 *
 * Refer to the README in this repository's root for more
 * information.
*/

// Dependencies
const
	fs = require('fs'),
	path = require('path');

let config; // Configuration object

// Sets configuration
const set = object => {
	config = object;
};

// Component inserter (micro API)
const handler = (content, meta) => {
	// These regular expressions are experimental and meant for
	// development environments unless there are no conflicts during
	// compiling.
	if (!meta) {
		// Define a regex to extract component metadata from relevant
		// HTML attributes.
		let regex = /<div.*data-meta="(.*)".*>/i;

		// Extract JSON metadata from the HTML.
		meta = JSON.parse(content.replace(regex, '$1'));
	}

	if (meta.components) {
		// Loop over all component metadata entries.
		for (const [ key, value ] of Object.entries(meta.components)) {
			if (value) {
				let
					// Generate HTML code for component.
					html = generate(key),
					regex = /(<div.+id="content"[^>]*>)(.*)(<\/div>)(?!<\/div>)/is,
					components = {
						footer: false, // Place after content
						header: true // Place before content
					};

				if (Object.keys(components).includes(key)) {
					// Inject component into content.
					content = content.replace(
						regex,
						components[key] ? `$1${html}$2$3` : `$1$2${html}$3`
					);
				}
			}
		}
	}

	// Return content with components inserted.
	return content;
};

const generate = component => {
	// Actions to be done based off of filename contents.
	let actions = {
		bundle: [ 'desktop', 'mobile' ],
		inject: [ 'button', 'item' ]
	};

	// Filter out template chunks for component.
	let chunks = fs.readdirSync(path.join(
		__dirname, 'templates'
	)).filter(template =>
		new RegExp(`^${component}`, 'i').test(template)
	);

	// Content that will eventually be returned.
	let content = '';

	if (chunks.length > 1) {
		// Read all chunks and build bundle/inject into bundle based
		// on filename.
		for (const [ action, symptoms ] of Object.entries(actions)) {
			for (const symptom of symptoms) {
				for (const chunk of chunks) {
					if (chunk.includes(symptom)) {
						if (action === 'bundle') {
							// Append chunk to bundle.
							content += fs.readFileSync(path.join(
								__dirname, 'templates', chunk
							)).toString();
						}
						else if (action === 'inject') {
							// Inject (generative) chunk into bundle.
							content = inject(content, chunk, component, symptom);
						}
					}
				}
			}
		}
	}
	else if (chunks.length === 1) {
		// Read single chunk.
		content = fs.readFileSync(path.join(
			__dirname, 'templates', chunks.at(0)
		)).toString();
	}

	// Return content.
	return content;
};

// Parses a template chunk
const inject = (content, chunk, component, element) => {
	let
		// Read the template chunk
		template = fs.readFileSync(path.join(
			__dirname, 'templates', chunk
		)).toString(),
		items = config.components[component][element],
		regexes = [];

	// Create regular epxressions for each key of an item of an
	// element of a component.
	for (const [ key, value ] of Object.entries(items.at(0))) {
		regexes.push(
			new RegExp(`{{${component}.${element}.${key}}}`, 'i')
		);
	}

	let clone;

	items.forEach(item => {
		// Replace each placeholder in the template.
		regexes.forEach((regex, index) => {
			clone = template.replace(
				regex,
				item[Object.keys(item).at(index)]
			);
		});

		// Append a modified template.
		clone += clone;
	});

	// Return the bundled template chunks with generative chunks
	// injected.
	return content.replace(/\{\{content\}\}/g, clone);
};

module.exports = {
	insert: handler,
	set: set
};
