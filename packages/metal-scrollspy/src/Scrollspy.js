'use strict';

import core from 'bower:metal/src/core';
import dom from 'bower:metal/src/dom/dom';
import Attribute from 'bower:metal/src/attribute/Attribute';
import Position from 'bower:metal-position/src/Position';

/**
 * Scrollspy utility.
 */
class Scrollspy extends Attribute {
	/**
	 * @inheritDoc
	 */
	constructor(opt_config) {
		super(opt_config);

		/**
		 * Holds the active index.
		 * @type {Number}
		 * @private
		 * @default -1
		 */
		this.activeIndex = -1;

		/**
		 * Holds the regions cache.
		 * @type {Object}
		 * @private
		 * @default []
		 */
		this.regions = [];

		/**
		 * Holds event handle that listens scroll shared event emitter proxy.
		 * @type {EventHandle}
		 * @protected
		 */
		this.scrollHandle_ = dom.on(this.scrollElement, 'scroll', this.checkPosition.bind(this));

		this.refresh();
		this.checkPosition();
		this.on('elementChanged', this.refresh);
		this.on('offsetChanged', this.refresh);
		this.on('scrollElementChanged', this.refresh);
		this.on('selectorChanged', this.refresh);
	}

	/**
	 * @inheritDoc
	 */
	disposeInternal() {
		this.deactivateAll();
		this.scrollHandle_.dispose();
		super.disposeInternal();
	}

	/**
	 * Activates index matching element.
	 * @param {Number} index
	 */
	activate(index) {
		if (this.activeIndex >= 0) {
			this.deactivate(this.activeIndex);
		}
		this.activeIndex = index;
		dom.addClasses(this.resolveElement(this.regions[index].link), this.activeClass);
	}

	/**
	 * Checks position of elements and activate the one in region.
	 */
	checkPosition() {
		var scrollHeight = this.getScrollHeight_();
		var scrollTop = Position.getScrollTop(this.scrollElement);

		if (this.activeIndex >= 0 && scrollTop < this.offset) {
			this.deactivateAll();
			return;
		}

		if (scrollHeight !== this.scrollHeight_) {
			this.refresh();
			return;
		}

		if (scrollHeight < scrollTop + this.offset) {
			this.activate(this.regions.length - 1);
			return;
		}

		var index = this.findBestRegionAt_(scrollTop);
		if (index >= 0 && index !== this.activeIndex) {
			this.activate(index);
		}
	}

	/**
	 * Deactivates index matching element.
	 * @param {Number} index
	 */
	deactivate(index) {
		dom.removeClasses(this.resolveElement(this.regions[index].link), this.activeClass);
	}

	/**
	 * Deactivates all elements.
	 */
	deactivateAll() {
		for (var i = 0; i < this.regions.length; i++) {
			this.deactivate(i);
		}
		this.activeIndex = -1;
	}

	/**
	 * Finds best region to activate.
	 * @param {number} scrollTop The scrollTop to use as reference.
	 * @return {number} The index of best region found.
	 */
	findBestRegionAt_(scrollTop) {
		var index = -1;
		var origin = scrollTop + this.offset + this.scrollElementRegion_.top;
		for (var i = 0; i < this.regions.length; i++) {
			var region = this.regions[i];
			if ((origin >= region.top) && (origin < region.bottom)) {
				index = i;
				break;
			}
		}
		return index;
	}

	/**
	 * Gets the scroll height of `scrollElement`.
	 * @return {Number}
	 */
	getScrollHeight_() {
		var scrollHeight = Position.getHeight(this.scrollElement);
		scrollHeight += this.scrollElementRegion_.top;
		scrollHeight -= Position.getClientHeight(this.scrollElement);
		return scrollHeight;
	}

	/**
	 * Refreshes all regions from document. Relevant when spying elements that
	 * nodes can be added and removed.
	 */
	refresh() {
		this.deactivateAll();

		this.scrollElementRegion_ = Position.getRegion(this.scrollElement);
		this.scrollHeight_ = this.getScrollHeight_();

		this.regions = [];
		var links = this.element.querySelectorAll(this.selector);
		var scrollTop = Position.getScrollTop(this.scrollElement);
		for (var i = 0; i < links.length; ++i) {
			var link = links[i];
			if (link.hash && (link.hash.length > 1)) {
				var element = document.getElementById(link.hash.substring(1));
				if (element) {
					var region = Position.getRegion(element);
					this.regions.push({
						link: link,
						top: region.top + scrollTop,
						bottom: region.bottom + scrollTop
					});
				}
			}
		}
		this.sortRegions_();
	}

	/**
	 * Sorts regions from lower to higher on y-axis.
	 * @protected
	 */
	sortRegions_() {
		this.regions.sort(function(a, b) {
			return a.top - b.top;
		});
	}
}

Scrollspy.ATTRS = {
	/**
	 * Class to be used as active class.
	 * @attribute activeClass
	 * @type {string}
	 */
	activeClass: {
		validator: core.isString,
		value: 'active'
	},

	/**
	 * Function that receives the matching element as argument and return
	 * itself. Relevant when the `activeClass` must be applied to a different
	 * element, e.g. a parentNode.
	 * @type {function}
	 * @default core.identityFunction
	 */
	resolveElement: {
		validator: core.isFunction,
		value: core.identityFunction
	},

	/**
	 * The scrollElement element to be used as scrollElement area for affix. The scrollElement is
	 * where the scroll event is listened from.
	 * @type {Element|Window}
	 */
	scrollElement: {
		setter: dom.toElement,
		value: document
	},

	/**
	 * Defines the offset that triggers scrollspy.
	 * @type {Number}
	 * @default 0
	 */
	offset: {
		validator: core.isNumber,
		value: 0
	},

	/**
	 * Element to be used as alignment reference of affix.
	 * @type {Element}
	 */
	element: {
		setter: dom.toElement
	},

	/**
	 * Selector to query elements inside `element` to be activated.
	 * @type {Element}
	 * @default 'a'
	 */
	selector: {
		validator: core.isString,
		value: 'a'
	}
};

export default Scrollspy;
