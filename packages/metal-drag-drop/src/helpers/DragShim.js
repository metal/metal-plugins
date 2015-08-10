'use strict';

import dom from 'bower:metal/src/dom/dom';

/**
 * Helper called by the `Drag` instance that creates a shim element
 * for attaching event listeners instead of attaching them to the
 * document. Helpful when dragging over iframes.
 */
class DragShim {
	/**
	 * Attaches a listener for the document. If `useShim` is true, a
	 * shim element covering the whole document will be created and
	 * the listener will be attached to it instead.
	 * @param {boolean} useShim
	 * @param {!Object<string, !function()>} listeners
	 * @return {!Array<!EventHandle>}
	 * @static
	 */
	static attachDocListeners(useShim, listeners) {
		var element = document;
		if (useShim) {
			element = DragShim.getShim();
			element.style.display = 'block';
		}
		var eventTypes = Object.keys(listeners);
		return eventTypes.map(function(type) {
			var isTouch = type.substr(0, 5) === 'touch';
			return dom.on(isTouch ? document : element, type, listeners[type]);
		});
	}

	/**
	 * Gets the shim element, creating it when called for the first time.
	 * @return {!Element}
	 * @static
	 */
	static getShim() {
		if (!DragShim.shim_) {
			DragShim.shim_ = document.createElement('div');
			DragShim.shim_.className = 'shim';
			DragShim.shim_.style.position = 'absolute';
			DragShim.shim_.style.top = 0;
			DragShim.shim_.style.left = 0;
			DragShim.shim_.style.width = '100%';
			DragShim.shim_.style.height = '100%';
			DragShim.shim_.style.display = 'none';
			DragShim.shim_.style.opacity = 0;
			DragShim.shim_.style.zIndex = 9999;
			dom.enterDocument(DragShim.shim_);
		}
		return DragShim.shim_;
	}

	/**
	 * Hides the shim element.
	 * @static
	 */
	static hide() {
		DragShim.getShim().style.display = 'none';
	}
}

/**
 * The shim element. This is only created when necessary.
 * @type {Element}
 * @protected
 * @static
 */
DragShim.shim_ = null;

export default DragShim;
