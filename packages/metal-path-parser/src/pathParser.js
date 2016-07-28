'use strict';

import core from 'metal';

var regex = /\/([^\/:(]*)(?:\:([A-Za-z0-9_]+))?(?:\(([^)]*)\))?([^\/]*)/g;

/**
 * Guarantes that the path will start with a "/".
 */
function normalizePath(path) {
	return path[0] === '/' ? path : '/' + path;
}

export function parse(path) {
	path = normalizePath(path);
	let unnamedCount = 0;
	const tokens = [];
	let currPath = '';

	let matches = regex.exec(path);
	while (matches) {
		currPath += '/' + matches[1];
		if (matches[2] || matches[3]) {
			if (currPath) {
				tokens.push(currPath);
				currPath = '';
			}
			tokens.push({
				name: matches[2] ? matches[2] : '' + unnamedCount++,
				pattern: matches[3] || '[^\\/]+'
			});
		}
		currPath += matches[4];
		matches = regex.exec(path);
	}

	if (currPath) {
		tokens.push(currPath);
	}
	return tokens;
}

export function toRegex(path) {
	var regex = '';
	var parsed = parse(path);
	for (var i = 0; i < parsed.length; i++) {
		if (core.isString(parsed[i])) {
			regex += parsed[i].replace('/', '\\/');
		} else {
			regex += '(' + parsed[i].pattern + ')';
		}
	}
	return new RegExp(regex);
}
