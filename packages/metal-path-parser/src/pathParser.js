'use strict';

import core from 'metal';

var regex = /([\/])?(?:(?:\:(\w+)(?:\(((?:\\.|[^\\()])*)\))?|\(((?:\\.|[^\\()])+)\))([+*?])?)/g;

function convertMatchesToObj(matches) {
	return {
		match: matches[0],
		prefix: matches[1],
		name: matches[2],
		paramPattern: matches[3],
		unnamedPattern: matches[4],
		modifier: matches[5]
	};
}

function convertTokensToRegex(tokens) {
	let regex = '';
	for (let i = 0; i < tokens.length; i++) {
		if (core.isString(tokens[i])) {
			regex += tokens[i].replace('/', '\\/');
		} else {
			regex += tokens[i].prefix + '(' + tokens[i].pattern + ')';
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
	let index = 0;

	let matches = regex.exec(route);
	while (matches) {
		var data = convertMatchesToObj(matches);

		currPath = route.slice(index, matches.index);
		index = matches.index + data.match.length;
		tokens.push(currPath);

		tokens.push({
			name: data.name ? data.name : '' + unnamedCount++,
			prefix: data.prefix || '',
			pattern: data.paramPattern || data.unnamedPattern || '[^\\/]+',
			repeat: data.modifier === '*' || data.modifier === '+',
			optional: data.modifier === '*' || data.modifier === '?'
		});

		matches = regex.exec(route);
	}

	if (index < route.length) {
		tokens.push(route.substr(index));
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
