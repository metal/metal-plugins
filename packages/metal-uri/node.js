'use strict';

var path = require('path');
var url = require('url');
var Uri = require('./lib/Uri').default;

Uri.setParseFn(function(urlStr) {
	var parsed = url.parse(urlStr);
	parsed.pathname = path.normalize(parsed.pathname);
	return parsed;
});

module.exports = Uri;
