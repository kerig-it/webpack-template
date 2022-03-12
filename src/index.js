/*
 * webpack-tmpl—A template repository for webpack applications.
 *
 * Refer to the README in this repository's root for more
 * information.
 *
 * GitHub: https://github.com/kerig-it/webpack-tmpl
 *
 * Made with ❤️ by Kerig.
*/

// Assets/resources
import config from '../config.json';

// Loads a page
const goto = async pathname => {

	// Await a fetch request.
	await fetch(
		`/pages/${pathname === '/' ? 'home' : pathname.replace(/^\/*/, '')}.html`,
		{ method: 'GET' }
	)
	.then(response => response.text())
	.then(data => {

		// Display the fetched data.
		document.body.innerHTML = data;

		// Update the history object.
		window.history.pushState(
			{ html: data },
			'',
			pathname
		);
	})
	.catch(error => {
		// If there was an error, throw it.
		throw error;
	});
};

// Main function
const main = () => {
	'use strict';
	
	goto(window.location.pathname);

	window.onpopstate = event => {
		if (event.state) {
			document.body.innerHTML = event.state.html;
		}
	};
};

try /*one's luck*/ {
	main();
}
catch (error) {
	// Throw errors.
	throw error;
}
