// Entry point for this webpack application.
//
// See the README for more information.
//
// GitHub: https://github.com/kerig-it/webpack-tmpl

// Import of assets/resources
import '../config.json'

// Loads a page
const goto = async pathname => {

	// Await a fetch request.
	await fetch(
		`/pages/${pathname === '/' ? 'home' : pathname.replace(/^\/*/, '')}.html`,
		{ method: 'GET' }
	)
	.then(response => {
		// Return response parsed as text.
		return response.text();
	})
	.then(data => {

		// Display fetched data.
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

// Main IIFE
(() => {
	'use strict';
	
	goto(window.location.pathname);

	window.onpopstate = event => {
		if (event.state) {
			document.body.innerHTML = event.state.html;
		}
	};
})();
