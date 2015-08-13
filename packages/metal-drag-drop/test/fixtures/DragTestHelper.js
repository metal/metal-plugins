'use strict';

import dom from 'bower:metal/src/dom/dom';

/**
 * This class has helper functions for testing the drag components
 */
class DragTestHelper {
	/**
	 * Triggers the given mouse event, building the correct data object
	 * with the given information, using the shim as target instead of
	 * the document, and turning the mouse event into the corresponding
	 * touch event if the test is running in a touch device.
	 * @param {!Element} target
	 * @param {string} eventType
	 * @param {number} x
	 * @param {number} y
	 * @param {number} button
	 */
	static triggerMouseEvent(target, eventType, x, y, button) {
		var data = {
			button: button ? button : 0,
			clientX: x,
			clientY: y
		};
		if ('ontouchstart' in window) {
			var eventTypesMap = {
				mousedown: 'touchstart',
				mousemove: 'touchmove',
				mouseup: 'touchend'
			};
			eventType = eventTypesMap[eventType];
			data = {
				targetTouches: [data]
			};
		}
		if (target === document) {
			target = document.querySelector('.shim') || document;
		}
		dom.triggerEvent(target, eventType, data);
	}
}

export default DragTestHelper;
