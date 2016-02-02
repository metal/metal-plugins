'use strict';

import { core } from 'metal';
import parseFromAnchor from './parseFromAnchor';

var hasUrlFn_ = core.isFunction(URL) && URL.length;

/**
 * Parses the given uri string into an object. The URL function will be used
 * when present, otherwise we'll fall back to the anchor node element.
 * @param {*=} opt_uri Optional string URI to parse
 */
function parse(opt_uri) {
	if (hasUrlFn_) {
		return new URL(opt_uri);
	} else {
		return parseFromAnchor(opt_uri);
	}
}

export default parse;
