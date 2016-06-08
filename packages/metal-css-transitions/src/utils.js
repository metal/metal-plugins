export function getChildrenMap(children) {
	const retObj = {};

	children.forEach(
		child => {
			if (child && child.config) {
				retObj[child.config.key] = child;
			}
		}
	);

	return retObj;
}

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