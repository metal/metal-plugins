'use strict';

import '@babel/polyfill';

/**
 * Debounces function execution.
 * @param {!function()} fn
 * @param {number} delay
 * @return {!function()}
 */
function debounce(fn, delay) {
	return function debounced() {
		let args = arguments;
		cancelDebounce(debounced);
		debounced.id = setTimeout(function() {
			fn(...(null, args));
		}, delay);
	};
}

/**
 * Cancels the scheduled debounced function.
 * @param {function()} debounced
 */
function cancelDebounce(debounced) {
	clearTimeout(debounced.id);
}

export default debounce;
export {cancelDebounce, debounce};
