'use strict';

import core from 'metal';
import {dom, features} from 'metal-dom';

/**
 * Anim class.
 */
class Anim {
	/**
	 * Emulates animation or transition end event, the end event with longer
	 * duration will be used by the emulation. If they have the same value,
	 * transitionend will be emulated.
	 * @param {!Element} element
	 * @param {number=} optDurationMs
	 * @return {!Object} Object containing `abort` function.
	 */
	static emulateEnd(element, optDurationMs) {
		if (
			this.getComputedDurationMs(element, 'animation') >
			this.getComputedDurationMs(element, 'transition')
		) {
			return this.emulateEnd_(element, 'animation', optDurationMs);
		} else {
			return this.emulateEnd_(element, 'transition', optDurationMs);
		}
	}

	/**
	 * Emulates animation end event. If `optDurationMs` not specified the value
	 * will read from computed style for animation-duration.
	 * @param {!Element} element
	 * @param {number=} optDurationMs
	 * @return {!Object} Object containing `abort` function.
	 */
	static emulateAnimationEnd(element, optDurationMs) {
		return this.emulateEnd_(element, 'animation', optDurationMs);
	}

	/**
	 * Emulates transition end event. If `optDurationMs` not specified the
	 * value will read from computed style for transition-duration.
	 * @param {!Element} element
	 * @param {number=} optDurationMs
	 * @return {!Object} Object containing `abort` function.
	 */
	static emulateTransitionEnd(element, optDurationMs) {
		return this.emulateEnd_(element, 'transition', optDurationMs);
	}

	/**
	 * Emulates transition or animation end.
	 * @param {!Element} element
	 * @param {string} type
	 * @param {number=} optDurationMs
	 * @return {!Object} Object containing `abort` function.
	 * @protected
	 */
	static emulateEnd_(element, type, optDurationMs) {
		let duration = optDurationMs;
		if (!core.isDef(optDurationMs)) {
			duration = this.getComputedDurationMs(element, type);
		}

		const delayed = setTimeout(function() {
			dom.triggerEvent(element, features.checkAnimationEventName()[type]);
		}, duration);

		const abort = function() {
			clearTimeout(delayed);
			hoistedEvtHandler.removeListener();
		};
		const hoistedEvtHandler = dom.once(element, type + 'end', abort);

		return {
			abort,
		};
	}

	/**
	 * Gets computed style duration for duration.
	 * @param {!Element} element
	 * @param {string} type
	 * @return {number} The computed duration in milliseconds.
	 */
	static getComputedDurationMs(element, type) {
		return (
			(parseFloat(
				window
					.getComputedStyle(element, null)
					.getPropertyValue(type + '-duration')
			) || 0) * 1000
		);
	}
}

export default Anim;
