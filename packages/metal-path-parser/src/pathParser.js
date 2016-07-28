'use strict';

import core from 'metal';

var regex = /\/([^\/:(]*)(?:\:([A-Za-z0-9_]+))?(?:\(([^)]*)\))?([^\/]*)/g;

function convertTokensToRegex(tokens) {
	let regex = '';
	for (let i = 0; i < tokens.length; i++) {
		if (core.isString(tokens[i])) {
			regex += tokens[i].replace('/', '\\/');
		} else {
			regex += '(' + tokens[i].pattern + ')';
		}
	}
	regex += '$';
	return new RegExp(regex);
}

/**
 * Guarantes that the route will start with a "/".
 */
function normalizePath(route) {
	return route[0] === '/' ? route : '/' + route;
}

export function parse(route) {
	route = normalizePath(route);
	let unnamedCount = 0;
	const tokens = [];
	let currPath = '';

	let matches = regex.exec(route);
	while (matches) {
		currPath += '/' + matches[1];
		if (matches[2] || matches[3]) {
			tokens.push(currPath);
			currPath = '';

			tokens.push({
				name: matches[2] ? matches[2] : '' + unnamedCount++,
				pattern: matches[3] || '[^\\/]+'
			});
		}
		currPath += matches[4];
		matches = regex.exec(route);
	}

	if (currPath) {
		tokens.push(currPath);
	}
	return tokens;
}

export function toRegex(route) {
	return convertTokensToRegex(parse(route));
}

export function extractData(routeOrTokens, path) {
	const data = {};
	const tokens = core.isString(routeOrTokens) ?
		parse(routeOrTokens) :
		routeOrTokens;
	const match = path.match(convertTokensToRegex(tokens));

	if (!match) {
		return null;
	}

	let paramIndex = 1;
	for (let i = 0; i < tokens.length; i++) {
		if (!core.isString(tokens[i])) {
			const value = match[paramIndex++];
			if (core.isDef(value)) {
				data[tokens[i].name] = value;
			}
		}
	}
	return data;
}
