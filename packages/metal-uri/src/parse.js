'use strict';

import URLParse from 'url-parse';

const MAX_PORT = 65535;

/**
 * Parses the given uri string into an object.
 * @param {*=} uri Optional string URI to parse
 * @return {Object}
 */
function parse(uri) {
	const url = new URLParse(uri);
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
		throw new TypeError('Port number can\'t exceed 65535');
	}
}

export default parse;
