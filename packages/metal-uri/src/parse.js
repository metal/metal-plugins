'use strict';

import { isFunction } from 'metal';
import parseFromAnchor from './parseFromAnchor';

/**
 * Parses the given uri string into an object. The URL function will be used
 * when present, otherwise we'll fall back to the anchor node element.
 * @param {*=} opt_uri Optional string URI to parse
 */
function parse(opt_uri) {
	if (isFunction(URL) && URL.length) {
		return new URL(opt_uri);
	} else {
		return parseFromAnchor(opt_uri);
	}
}

export default parse;
