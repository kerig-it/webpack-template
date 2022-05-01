/*
 * webpack-template—A template repository for webpack applications.
 *
 * Refer to the README in this repository's root for more
 * information.
 *
 * GitHub: https://github.com/kerig-it/webpack-template
 *
 * Made with ❤️ by Kerig.
*/

import Pjax from 'pjax/pjax.js';

const pjax = new Pjax({
	selectors: [ '*[data-pjax=true]' ]
});
