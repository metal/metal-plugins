'use strict';

// This dependency is used to polyfill Array.from method that is used in
// _toConsumableArray() function in babel glue to this rest-spread utilization
import from from 'core-js/es6/array'; //eslint-disable-line

/**
 * Debounces function execution.
 * @param {!function()} fn
 * @param {number} [delay=0]
 * @return {!function()}
 */
function throttle(fn, delay = 0) {
	let last = 0;

	return (...args) => {
		const next = last + delay;
		const now = Date.now();

		if (next < now) {
			try {
				fn.call(null, ...args);
			} catch (error) {
				throw error;
			} finally {
				last = Date.now();
			}
		}
	};
}

export default throttle;
export {throttle};
