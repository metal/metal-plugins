'use strict';

var Uri = require('./lib/Uri').default;

if (typeof document === 'undefined') {
	// If there's no document, then this should be running in NodeJS, and so
	// we should use the "url" node module as the parse function.

	var path = require('path');
	var url = require('url');
	Uri.setParseFn(function(urlStr) {
		var parsed = url.parse(urlStr);
		parsed.pathname = path.normalize(parsed.pathname);
		return parsed;
	});
}

module.exports = Uri;
