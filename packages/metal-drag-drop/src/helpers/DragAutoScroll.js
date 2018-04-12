'use strict';

import core from 'metal';
import State from 'metal-state';
import Position from 'metal-position';

/**
 * Helper called by the `Drag` instance that scrolls elements when the
 * mouse is near their boundaries.
 */
class DragAutoScroll extends State {
	/**
	 * @inheritDoc
	 */
	constructor(config) {
		super(config);

		/**
		 * The handler for the current call to `setTimeout`.
		 * @type {?number}
		 * @protected
		 */
		this.scrollTimeout_ = null;
	}

	/**
	 * @inheritDoc
	 */
	disposeInternal() {
		super.disposeInternal();
		this.stop();
	}

	/**
	 * Gets the region for the given scroll container, without including scroll.
	 * @param {!Element} scrollContainer
	 * @return {!Object}
	 * @protected
	 */
	getRegionWithoutScroll_(scrollContainer) {
		if (core.isDocument(scrollContainer)) {
			let height = window.innerHeight;
			let width = window.innerWidth;
			return Position.makeRegion(height, height, 0, width, 0, width);
		} else {
			return Position.getRegion(scrollContainer);
		}
	}

	/**
	 * Schedules a function to scroll the given containers.
	 * @param {!Array<!Element>} scrollContainers
	 * @param {number} mouseX
	 * @param {number} mouseY
	 */
	scroll(scrollContainers, mouseX, mouseY) {
		this.stop();
		this.scrollTimeout_ = setTimeout(
			this.scrollInternal_.bind(this, scrollContainers, mouseX, mouseY),
			this.delay
		);
	}

	/**
	 * Adds the given deltas to the given element's scroll position.
	 * @param {!Element} element
	 * @param {number} deltaX
	 * @param {number} deltaY
	 * @protected
	 */
	scrollElement_(element, deltaX, deltaY) {
		if (core.isDocument(element)) {
			window.scrollBy(deltaX, deltaY);
		} else {
			element.scrollTop += deltaY;
			element.scrollLeft += deltaX;
		}
	}

	/**
	 * Scrolls the given containers if the mouse is near their boundaries.
	 * @param {!Array<!Element>} scrollContainers
	 * @param {number} mouseX
	 * @param {number} mouseY
	 * @protected
	 */
	scrollInternal_(scrollContainers, mouseX, mouseY) {
		for (let i = 0; i < scrollContainers.length; i++) {
			let scrollRegion = this.getRegionWithoutScroll_(
				scrollContainers[i]
			); // eslint-disable-line
			if (!Position.pointInsideRegion(mouseX, mouseY, scrollRegion)) {
				continue;
			}

			let deltaX = 0;
			let deltaY = 0;
			let scrollTop = Position.getScrollTop(scrollContainers[i]);
			let scrollLeft = Position.getScrollLeft(scrollContainers[i]);
			if (
				scrollLeft > 0 &&
				Math.abs(mouseX - scrollRegion.left) <= this.maxDistance
			) {
				deltaX -= this.speed;
				// eslint-disable-next-line
			} else if (
				Math.abs(mouseX - scrollRegion.right) <= this.maxDistance
			) {
				deltaX += this.speed;
			}
			if (
				scrollTop > 0 &&
				Math.abs(mouseY - scrollRegion.top) <= this.maxDistance
			) {
				deltaY -= this.speed;
				// eslint-disable-next-line
			} else if (
				Math.abs(mouseY - scrollRegion.bottom) <= this.maxDistance
			) {
				deltaY += this.speed;
			}

			if (deltaX || deltaY) {
				this.scrollElement_(scrollContainers[i], deltaX, deltaY);
				this.scroll(scrollContainers, mouseX, mouseY);
				break;
			}
		}
	}

	/**
	 * Stops any auto scrolling that was scheduled to happen in the future.
	 */
	stop() {
		clearTimeout(this.scrollTimeout_);
	}
}

/**
 * State definition.
 * @type {!Object}
 * @static
 */
DragAutoScroll.STATE = {
	/**
	 * The delay in ms before an element is scrolled automatically.
	 * @type {number}
	 * @default 200
	 */
	delay: {
		validator: core.isNumber,
		value: 50,
	},

	/**
	 * The maximum distance the mouse needs to be from an element before
	 * it will be scrolled automatically.
	 * @type {number}
	 * @default 10
	 */
	maxDistance: {
		validator: core.isNumber,
		value: 20,
	},

	/**
	 * The number of pixels that will be scrolled each time.
	 * @type {number}
	 * @default 10
	 */
	speed: {
		validator: core.isNumber,
		value: 20,
	},
};

export {DragAutoScroll};
export default DragAutoScroll;
