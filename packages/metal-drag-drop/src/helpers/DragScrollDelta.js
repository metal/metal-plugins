'use strict';

import dom from 'metal-dom';
import { EventEmitter, EventHandler } from 'metal-events';
import Position from 'metal-position';

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
	 * Handles a "scroll" event, emitting a "scrollDelta" event with the
	 * difference between the previous and new values.
	 * @param {number} index
	 * @param {!Event} event
	 * @protected
	 */
	handleScroll_(index, event) {
		var newPosition = {
			scrollLeft: Position.getScrollLeft(event.currentTarget),
			scrollTop: Position.getScrollTop(event.currentTarget)
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
		if (getComputedStyle(dragNode).position === 'fixed') {
			// If the drag node's position is "fixed", then its coordinates don't need to
			// be updated when parents are scrolled.
			return;
		}

		for (var i = 0; i < scrollContainers.length; i++) {
			if (dom.contains(scrollContainers[i], dragNode)) {
				this.scrollPositions_.push({
					scrollLeft: Position.getScrollLeft(scrollContainers[i]),
					scrollTop: Position.getScrollTop(scrollContainers[i])
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

export { DragScrollDelta };
export default DragScrollDelta;
