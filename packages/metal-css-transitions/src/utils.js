'use strict';

/**
 * Processes an array of components, creating an object with keys and values.
 * If the component does not already have a key, it will be given a unique key.
 * @param {!Array} children Array of metal components.
 */
export function getChildrenMap(children) {
	let COUNTER = 1;

	const retObj = {};

	const keys = children.map(
		child => child.config ? child.config.key : undefined
	);

	children.forEach(
		child => {
			if (child && child.config) {
				let {key} = child.config;

				if (!key) {
					while (keys.indexOf(COUNTER) !== -1) {
						COUNTER += 1;
					}

					key = COUNTER;

					keys.push(key);

					child.config.key = key;
				}

				retObj[key] = child;
			}
		}
	);

	return retObj;
}

/**
 * Merges two children maps so that there are no duplicates.
 * @param {!Object} next Map of new children components.
 * @param {!Object} prev Map of previous children components.
 */
export function mergeChildrenMap(next = {}, prev = {}) {
	function getValueForKey(key) {
		if (next.hasOwnProperty(key)) {
			return next[key];
		} else {
			return prev[key];
		}
	}

	const nextKeysPending = {};

	let pendingKeys = [];

	for (let prevKey in prev) {
		if (next.hasOwnProperty(prevKey)) {
			if (pendingKeys.length) {
				nextKeysPending[prevKey] = pendingKeys;

				pendingKeys = [];
			}
		} else {
			pendingKeys.push(prevKey);
		}
	}

	const mergedMap = {};

	for (let nextKey in next) {
		if (nextKeysPending.hasOwnProperty(nextKey)) {
			for (let i = 0; i < nextKeysPending[nextKey].length; i++) {
				const pendingNextKey = nextKeysPending[nextKey][i];

				mergedMap[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
			}
		}

		mergedMap[nextKey] = getValueForKey(nextKey);
	}

	for (let i = 0; i < pendingKeys.length; i++) {
		mergedMap[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
	}

	return mergedMap;
}