/**
 * Returns whether the browser is Safari
 * @return {boolean}
 */
function isSafari() {
	const nav = window && window.navigator || {};
	return /^((?!chrome|android|crios|fxios).)*safari/i.test(nav.userAgent);
}

/**
 * Returns whether the browser is the specified version of Safari
 * @return {boolean}
 */
function isSafariVersion(version) {
	const nav = window && window.navigator || {};
	let result;
	if (!isSafari()) return false;
	return !!(new RegExp('Version\/' + version).exec(nav.userAgent));
}

export { isSafari, isSafariVersion };