'use strict';

import dom from 'metal-dom';

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
			element = DragShim.getDocShim();
			element.style.display = 'block';
		}
		var eventTypes = Object.keys(listeners);
		return eventTypes.map(function(type) {
			var isTouch = type.substr(0, 5) === 'touch';
			return dom.on(isTouch ? document : element, type, listeners[type]);
		});
	}

	/**
	 * Gets the document's shim element, creating it when called for the first time.
	 * @return {!Element}
	 * @static
	 */
	static getDocShim() {
		if (!DragShim.docShim_) {
			DragShim.docShim_ = document.createElement('div');
			DragShim.docShim_.className = 'shim';
			DragShim.docShim_.style.position = 'fixed';
			DragShim.docShim_.style.top = 0;
			DragShim.docShim_.style.left = 0;
			DragShim.docShim_.style.width = '100%';
			DragShim.docShim_.style.height = '100%';
			DragShim.docShim_.style.display = 'none';
			DragShim.docShim_.style.opacity = 0;
			DragShim.docShim_.style.zIndex = 9999;
			dom.enterDocument(DragShim.docShim_);
		}
		return DragShim.docShim_;
	}

	/**
	 * Hides the document's shim element.
	 * @static
	 */
	static hideDocShim() {
		DragShim.getDocShim().style.display = 'none';
	}

	/**
	 * Resets `DragShim`, removing the shim element from the document
	 * and clearing its variable so it can be created again.
	 * @static
	 */
	static reset() {
		if (DragShim.docShim_) {
			dom.exitDocument(DragShim.docShim_);
			DragShim.docShim_ = null;
		}
	}
}

/**
 * The shim element. This is only created when necessary.
 * @type {Element}
 * @protected
 * @static
 */
DragShim.docShim_ = null;

export { DragShim }; 
export default DragShim;
