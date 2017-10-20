'use strict';

import URLParse from 'url-parse';

const MAX_PORT = 65535;

/**
 * Parses the given uri string into an object.
 * @param {*=} opt_uri Optional string URI to parse
 */
function parse(opt_uri) {
	const url = new URLParse(opt_uri);
	url.search = url.query;
	validatePort(url.port);
	return url;
}

/**
 * Validates port number and throws `TypeError` if it exceeds `65535`.
 * @param {!number} port Port number from parsed url
 */
function validatePort(port) {
	if (port && port > MAX_PORT) {
		throw TypeError('Port number can\'t exceed 65535');
	}
}

export default parse;
