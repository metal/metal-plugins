'use strict';

import core from 'metal';

const REGEX = /([\/])?(?:(?:\:(\w+)(?:\(((?:\\.|[^\\()])*)\))?|\(((?:\\.|[^\\()])+)\))([+*?])?)/g;

/**
 * Converts the given array of regex matches to a more readable object format.
 * @param {!Array<string>} matches
 * @return {!Object}
 */
function convertMatchesToObj(matches) {
	return {
		match: matches[0],
		prefix: matches[1],
		name: matches[2],
		paramPattern: matches[3],
		unnamedPattern: matches[4],
		modifier: matches[5],
	};
}

/**
 * Converts the given tokens parsed from a route format string to a regex.
 * @param {!Array<string|!Object>} tokens
 * @return {!RegExp}
 */
function convertTokensToRegex(tokens) {
	let regex = '';
	for (let i = 0; i < tokens.length; i++) {
		if (core.isString(tokens[i])) {
			regex += escape(tokens[i]);
		} else {
			let capture = encloseNonCapturingGroup(tokens[i].pattern);
			if (tokens[i].repeat) {
				capture += encloseNonCapturingGroup('\\/' + capture) + '*';
			}
			capture = escape(tokens[i].prefix) + `(${capture})`;
			if (tokens[i].optional) {
				if (!tokens[i].partial) {
					capture = encloseNonCapturingGroup(capture);
				}
				capture += '?';
			}
			regex += capture;
		}
	}
	return new RegExp('^' + makeTrailingSlashOptional(regex) + '$');
}

/**
 * Encloses the given regex pattern into a non capturing group.
 * @param {string} pattern
 * @return {string}
 */
function encloseNonCapturingGroup(pattern) {
	return `(?:${pattern})`;
}

/**
 * Escapes the given string to show up in the path regex.
 * @param {string} str
 * @return {string}
 */
function escape(str) {
	return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1');
}

/**
 * Makes trailing slash optional on paths.
 * @param {string} regex
 * @return {string}
 */
function makeTrailingSlashOptional(regex) {
	if (/\/$/.test(regex)) {
		regex += '?';
	} else {
		regex += '\\/?';
	}
	return regex;
}

/**
 * Parses the given route format string into tokens representing its contents.
 * @param {!Array|string} routeOrTokens Either a route format string or tokens
 *     previously parsed via the `parse` function.
 * @return {!Array<string|!Object>} An array of tokens that can be either plain
 *     strings (part of the route) or objects containing informations on params.
 */
export function parse(routeOrTokens) {
	if (!core.isString(routeOrTokens)) {
		return routeOrTokens;
	}

	const route = routeOrTokens;
	let unnamedCount = 0;
	const tokens = [];
	let currPath = '';
	let index = 0;

	let matches = REGEX.exec(route);
	while (matches) {
		const data = convertMatchesToObj(matches);

		currPath = route.slice(index, matches.index);
		index = matches.index + data.match.length;
		tokens.push(currPath);

		tokens.push({
			name: data.name ? data.name : '' + unnamedCount++,
			partial: route[index] && route[index] !== data.prefix,
			prefix: data.prefix || '',
			pattern: data.paramPattern || data.unnamedPattern || '[^\\/]+',
			repeat: data.modifier === '*' || data.modifier === '+',
			optional: data.modifier === '*' || data.modifier === '?',
		});

		matches = REGEX.exec(route);
	}

	if (index < route.length) {
		tokens.push(route.substr(index));
	}
	return tokens;
}

/**
 * Converts the given route format string to a regex that can extract param
 * data from paths matching it.
 * @param {!Array|string} routeOrTokens Either a route format string or tokens
 *     previously parsed via the `parse` function.
 * @return {!RegExp}
 */
export function toRegex(routeOrTokens) {
	return convertTokensToRegex(parse(routeOrTokens));
}

/**
 * Extracts data from the given path according to the specified route format.
 * @param {!Array|string} routeOrTokens Either a route format string or tokens
 *     previously parsed via the `parse` function.
 * @param {string} path The path to extract param data from.
 * @return {Object<string, string>} The data object, or null if the path doesn't
 *     match the given format.
 */
export function extractData(routeOrTokens, path) {
	const data = {};
	const tokens = parse(routeOrTokens);
	const match = path.match(convertTokensToRegex(tokens));

	if (!match) {
		return null;
	}

	let paramIndex = 1;
	for (let i = 0; i < tokens.length; i++) {
		if (!core.isString(tokens[i])) {
			let value = match[paramIndex++];
			if (core.isDef(value)) {
				if (tokens[i].repeat) {
					value = value.split('/');
				}
				data[tokens[i].name] = value;
			}
		}
	}
	return data;
}
