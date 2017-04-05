'use strict';

/**
 * Processes an array of components, creating an object with keys and values.
 * If the component does not already have a key, it will be given a unique key.
 * @param {!Array} children Array of metal components.
 */
export function getChildrenMap(children) {
	let COUNTER = 1;

	const retMap = new Map();

	const keys = children.map(
		child => child.props ? child.props.key : undefined
	);

	children.forEach(
		child => {
			if (child && child.props) {
				let {
					props: {key},
					tag
				} = child;

				if (!key && tag) {
					if (typeof tag !== 'string') {
						if (typeof tag === 'function') {
							tag = tag.name;
						}
						else {
							tag = 'metal';
						}
					}

					while (keys.indexOf(`${tag}-${COUNTER}`) !== -1) {
						COUNTER += 1;
					}

					key = `${tag}-${COUNTER}`;

					keys.push(key);

					child.props.key = key;
				}

				retMap.set(key, child);
			}
		}
	);

	return retMap;
}

/**
 * Merges two children maps so that there are no duplicates.
 * @param {!Object} next Map of new children components.
 * @param {!Object} prev Map of previous children components.
 */
const map = new Map();

export function mergeChildrenMap(nextMap = map, prevMap = map) {
	function getValueForKey(key) {
		if (nextMap.has(key)) {
			return nextMap.get(key);
		} else {
			return prevMap.get(key);
		}
	}

	const nextKeysPending = {};

	let pendingKeys = [];

	prevMap.forEach(
		(value, prevKey) => {
			if (nextMap.has(prevKey)) {
				if (pendingKeys.length) {
					nextKeysPending[prevKey] = pendingKeys;

					pendingKeys = [];
				}
			} else {
				pendingKeys.push(prevKey);
			}
		}
	);

	const mergedMap = new Map();

	for (let i = 0; i < pendingKeys.length; i++) {
		mergedMap.set(pendingKeys[i], getValueForKey(pendingKeys[i]));
	}

	nextMap.forEach(
		(value, nextKey) => {
			if (nextKeysPending.hasOwnProperty(nextKey)) {
				for (let i = 0; i < nextKeysPending[nextKey].length; i++) {
					const pendingNextKey = nextKeysPending[nextKey][i];

					mergedMap.set(nextKeysPending[nextKey][i], getValueForKey(pendingNextKey));
				}
			}

			mergedMap.set(nextKey, getValueForKey(nextKey));
		}
	);

	return mergedMap;
}
