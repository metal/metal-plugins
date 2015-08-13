'use strict';

import core from 'bower:metal/src/core';
import dom from 'bower:metal/src/dom/dom';
import EventEmitter from 'bower:metal/src/events/EventEmitter';
import EventHandler from 'bower:metal/src/events/EventHandler';

/**
 * Helper called by the `Drag` instance that emits an event whenever
 * the scroll position of the given containers change.
 */
class DragScrollDelta extends EventEmitter {
	/**
	 * @inheritDoc
	 */
	constructor() {
		super();
		/**
		 * `EventHandler` for the scroll events.
		 * @type {EventHandler}
		 * @protected
		 */
		this.handler_ = new EventHandler();

		/**
		 * The scroll positions for the scroll elements that are being listened to.
		 * @type {Array}
		 * @protected
		 */
		this.scrollPositions_ = [];
	}

	/**
	 * @inheritDoc
	 */
	disposeInternal() {
		super.disposeInternal();
		this.stop();
		this.handler_ = null;
	}

	/**
	 * Gets the scroll element for the given element. That's necessary because
	 * when an event is triggered on the document, the element with the scroll
	 * positions is the body, not the actual document.
	 * @param {!Element} element
	 * @return {boolean}
	 * @protected
	 */
	getScrollElement_(element) {
		return core.isDocument(element) ? element.body : element;
	}

	/**
	 * Handles a "scroll" event, emitting a "scrollDelta" event with the
	 * difference between the previous and new values.
	 * @param {number} index
	 * @param {!Event} event
	 * @protected
	 */
	handleScroll_(index, event) {
		var element = this.getScrollElement_(event.currentTarget);
		var newPosition = {
			scrollLeft: element.scrollLeft,
			scrollTop: element.scrollTop
		};
		var position = this.scrollPositions_[index];
		this.scrollPositions_[index] = newPosition;

		this.emit('scrollDelta', {
			deltaX: newPosition.scrollLeft - position.scrollLeft,
			deltaY: newPosition.scrollTop - position.scrollTop
		});
	}

	/**
	 * Starts listening to scroll changes on the given elements that contain
	 * the current drag node.
	 * @param {!Element} dragNode
	 * @param {!Array<!Element>} scrollContainers
	 */
	start(dragNode, scrollContainers) {
		if (!dragNode.offsetParent) {
			// If the drag node has no offset parent, then its position is "fixed",
			// and so its coordinates don't need to be updated when parents are scrolled.
			return;
		}

		for (var i = 0; i < scrollContainers.length; i++) {
			if (scrollContainers[i].contains(dragNode)) {
				var scrollElement = this.getScrollElement_(scrollContainers[i]);
				this.scrollPositions_.push({
					scrollLeft: scrollElement.scrollLeft,
					scrollTop: scrollElement.scrollTop
				});

				var index = this.scrollPositions_.length - 1;
				this.handler_.add(dom.on(scrollContainers[i], 'scroll', this.handleScroll_.bind(this, index)));
			}
		}
	}

	/**
	 * Stops listening to scroll changes.
	 */
	stop() {
		this.handler_.removeAllListeners();
		this.scrollPositions_ = [];
	}
}

export default DragScrollDelta;
