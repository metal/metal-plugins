'use strict';

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
