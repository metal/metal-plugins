'use strict';

var url = require('url');
var Uri = require('./lib/Uri').default;

Uri.setParseFn(url.parse);

module.exports = Uri;
