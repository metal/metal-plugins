'use strict';

/**
 * Helper function to determine whether the given uri contains port section
 * @param {string} uri String URI to check
 */
function isPortProvidedToURL(uri) {
	return /:\d+(?!\@)/.test(uri);
} 

/** 
 * Helper function to check whether the browser has invalidated
 * the <a> element due incorrect URI. This vary across implementations
 * and platforms hence the various attempts to assure the logic
 * will work against all major browsers.
 * @param {object} a Anchor typed DOMElement
 */
function isAnchorInvalidatedByBrowser(a) {
	// try-catch clouse is required as IE11 throws Error when
	// accessing either of these attributes when the URL is invalid
	try {
		if ('javascript:' === a.protocol) return false; // don't throw anything as URL doesn't do it either
		if (':' === a.protocol) return true; 
		if (!/:/.test(a.href)) return true;
		if (isPortProvidedToURL(a) && '' === a.port) return true;
	} catch (e) {
		// re-throw any sort of exception as a TypeError
		throw new TypeError(e.message);
	}
	return false;
}

/**
 * Parses the given uri string into an object.
 * @param {*=} opt_uri Optional string URI to parse
 */
function parseFromAnchor(opt_uri) {
	var link = document.createElement('a');
	link.href = opt_uri;

	if (isAnchorInvalidatedByBrowser(link)) {
		throw new TypeError(`${opt_uri} is not a valid URL`);
	}

	return {
		hash: link.hash,
		hostname: link.hostname,
		password: link.password,
		pathname: link.pathname[0] === '/' ? link.pathname : '/' + link.pathname,
		port: link.port,
		protocol: link.protocol,
		search: link.search,
		username: link.username
	};
}

export default parseFromAnchor;
