'use strict';

import assert from 'assert';
import Uri from '../../src/Uri';
import url from 'url';
import path from 'path';

Uri.setParseFn(function(urlStr) {
	var parsed = url.parse(urlStr);
	parsed.pathname = path.normalize(parsed.pathname);
	return parsed;
});

global.assert = assert;
