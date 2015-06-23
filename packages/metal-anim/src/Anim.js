'use strict';

import core from 'bower:metal/src/core';
import dom from 'bower:metal/src/dom/dom';
import features from 'bower:metal/src/dom/features';

class Anim {
	/**
	 * Emulates animation or transition end event, the first end event that
	 * fires will be used by the emulation.
	 * @param {Element} element
	 * @param {number} opt_durationMs
	 */
	static emulateEnd(element, opt_durationMs) {
		var animation = this.emulateEnd_(element, 'animation', opt_durationMs);
		var transition = this.emulateEnd_(element, 'transition', opt_durationMs);
		dom.once(element, 'animationend', transition.abort);
		dom.once(element, 'transitionend', animation.abort);
	}

	/**
	 * Emulates animation end event. If `opt_durationMs` not specified the value
	 * will read from computed style for animation-duration.
	 * @param {Element} element
	 * @param {number} opt_durationMs
	 */
	static emulateAnimationEnd(element, opt_durationMs) {
		this.emulateEnd_(element, 'animation', opt_durationMs);
	}

	/**
	 * Emulates transition end event. If `opt_durationMs` not specified the
	 * value will read from computed style for transition-duration.
	 * @param {Element} element
	 * @param {number} opt_durationMs
	 */
	static emulateTransitionEnd(element, opt_durationMs) {
		this.emulateEnd_(element, 'transition', opt_durationMs);
	}

	/**
	 * Emulates transition or animation end.
	 * @param {Element} element
	 * @param {string} type
	 * @param {number} opt_durationMs
	 * @protected
	 */
	static emulateEnd_(element, type, opt_durationMs) {
		var duration = opt_durationMs;
		if (!core.isDef(opt_durationMs)) {
			duration = (parseFloat(window.getComputedStyle(element, null).getPropertyValue(type + '-duration')) || 0) * 1000;
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
}

export default Anim;
