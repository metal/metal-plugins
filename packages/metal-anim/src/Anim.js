'use strict';

import core from 'metal';
import { dom, features } from 'metal-dom';

class Anim {
	/**
	 * Emulates animation or transition end event, the end event with longer
	 * duration will be used by the emulation. If they have the same value,
	 * transitionend will be emulated.
	 * @param {!Element} element
	 * @param {number=} opt_durationMs
	 * @return {!Object} Object containing `abort` function.
	 */
	static emulateEnd(element, opt_durationMs) {
		if (this.getComputedDurationMs(element, 'animation') > this.getComputedDurationMs(element, 'transition')) {
			return this.emulateEnd_(element, 'animation', opt_durationMs);
		} else {
			return this.emulateEnd_(element, 'transition', opt_durationMs);
		}
	}

	/**
	 * Emulates animation end event. If `opt_durationMs` not specified the value
	 * will read from computed style for animation-duration.
	 * @param {!Element} element
	 * @param {number=} opt_durationMs
	 * @return {!Object} Object containing `abort` function.
	 */
	static emulateAnimationEnd(element, opt_durationMs) {
		return this.emulateEnd_(element, 'animation', opt_durationMs);
	}

	/**
	 * Emulates transition end event. If `opt_durationMs` not specified the
	 * value will read from computed style for transition-duration.
	 * @param {!Element} element
	 * @param {number=} opt_durationMs
	 * @return {!Object} Object containing `abort` function.
	 */
	static emulateTransitionEnd(element, opt_durationMs) {
		this.emulateEnd_(element, 'transition', opt_durationMs);
	}

	/**
	 * Emulates transition or animation end.
	 * @param {!Element} element
	 * @param {string} type
	 * @param {number=} opt_durationMs
	 * @return {!Object} Object containing `abort` function.
	 * @protected
	 */
	static emulateEnd_(element, type, opt_durationMs) {
		var duration = opt_durationMs;
		if (!core.isDef(opt_durationMs)) {
			duration = this.getComputedDurationMs(element, type);
		}

		var delayed = setTimeout(function() {
			dom.triggerEvent(element, features.checkAnimationEventName()[type]);
		}, duration);

		var abort = function() {
			clearTimeout(delayed);
			hoistedEvtHandler.removeListener();
		};
		var hoistedEvtHandler = dom.once(element, type + 'end', abort);

		return {
			abort: abort
		};
	}

	/**
	 * Gets computed style duration for duration.
	 * @param {!Element} element
	 * @param {string} type
	 * @return {number} The computed duration in milliseconds.
	 */
	static getComputedDurationMs(element, type) {
		return (parseFloat(window.getComputedStyle(element, null).getPropertyValue(type + '-duration')) || 0) * 1000;
	}
}

export default Anim;
