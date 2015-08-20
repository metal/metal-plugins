'use strict';

import core from 'bower:metal/src/core';
import Attribute from 'bower:metal/src/attribute/Attribute';
import Position from 'bower:metal-position/src/Position';

/**
 * Helper called by the `Drag` instance that scrolls elements when the
 * mouse is near their boundaries.
 */
class DragAutoScroll extends Attribute {
	/**
	 * @inheritDoc
	 */
	constructor(opt_config) {
		super(opt_config);

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
			var height = window.innerHeight;
			var width = window.innerWidth;
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
	 * Scrolls the given containers if the mouse is near their boundaries.
	 * @param {!Array<!Element>} scrollContainers
	 * @param {number} mouseX
	 * @param {number} mouseY
	 * @protected
	 */
	scrollInternal_(scrollContainers, mouseX, mouseY) {
		var scrolled = false;
		for (var i = 0; i < scrollContainers.length; i++) {
			var scrollRegion = this.getRegionWithoutScroll_(scrollContainers[i]);
			if (!Position.pointInsideRegion(mouseX, mouseY, scrollRegion)) {
				continue;
			}

			var scrollElement = scrollContainers[i];
			if (core.isDocument(scrollElement)) {
				scrollElement = scrollElement.body;
			}
			if (Math.abs(mouseX - scrollRegion.left) <= this.maxDistance) {
				scrollElement.scrollLeft -= this.speed;
				scrolled = true;
			}
			if (Math.abs(mouseX - scrollRegion.right) <= this.maxDistance) {
				scrollElement.scrollLeft += this.speed;
				scrolled = true;
			}
			if (Math.abs(mouseY - scrollRegion.top) <= this.maxDistance) {
				scrollElement.scrollTop -= this.speed;
				scrolled = true;
			}
			if (Math.abs(mouseY - scrollRegion.bottom) <= this.maxDistance) {
				scrollElement.scrollTop += this.speed;
				scrolled = true;
			}

			if (scrolled) {
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
 * Attributes definition.
 * @type {!Object}
 * @static
 */
DragAutoScroll.ATTRS = {
	/**
	 * The delay in ms before an element is scrolled automatically.
	 * @type {number}
	 * @default 200
	 */
	delay: {
		validator: core.isNumber,
		value: 50
	},

	/**
	 * The maximum distance the mouse needs to be from an element before
	 * it will be scrolled automatically.
	 * @type {number}
	 * @default 10
	 */
	maxDistance: {
		validator: core.isNumber,
		value: 20
	},

	/**
	 * The number of pixels that will be scrolled each time.
	 * @type {number}
	 * @default 10
	 */
	speed: {
		validator: core.isNumber,
		value: 20
	}
};

export default DragAutoScroll;
