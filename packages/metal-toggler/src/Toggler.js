'use strict';

import core from 'metal';
import dom from 'metal-dom';
import { EventHandler } from 'metal-events';
import State from 'metal-state';

/**
 * Toggler component.
 */
class Toggler extends State {
	/**
	 * @inheritDoc
	 */
	constructor(opt_config) {
		super(opt_config);

		this.headerEventHandler_ = new EventHandler();

		this.on('headerChanged', this.syncHeader);
		this.syncHeader();
	}

	/**
	 * @inheritDoc
	 */
	disposeInternal() {
		super.disposeInternal();
		this.headerEventHandler_.removeAllListeners();
	}

	/**
	* Manually collapse the content's visibility.
	* @param {!Element} header
	*/
	collapse(header = this.header) {
		var content = this.getContentElement_(header);
		dom.removeClasses(content, this.expandedClasses);
		dom.addClasses(content, this.collapsedClasses);
		dom.removeClasses(header, this.headerExpandedClasses);
		dom.addClasses(header, this.headerCollapsedClasses);
	}

	/**
	* Manually expand the content's visibility.
	* @param {!Element} header
	*/
	expand(header = this.header) {
		var content = this.getContentElement_(header);
		dom.addClasses(content, this.expandedClasses);
		dom.removeClasses(content, this.collapsedClasses);
		dom.addClasses(header, this.headerExpandedClasses);
		dom.removeClasses(header, this.headerCollapsedClasses);
	}

	/**
	 * Gets the content to be toggled by the given header element.
	 * @param {!Element} header
	 * @protected
	 */
	getContentElement_(header) {
		if (core.isElement(this.content)) {
			return this.content;
		}

		var content = dom.next(header, this.content);
		if (content) {
			return content;
		}

		if (core.isElement(header)){
			content = header.querySelector(this.content);
			if (content) {
				return content;
			}
		}

		return this.container.querySelector(this.content);
	}

	/**
	 * Handles a `click` event on the header.
	 * @param {!Event} event
	 * @protected
	 */
	handleClick_(event) {
		this.toggle(event.delegateTarget || event.currentTarget);
	}

	/**
	 * Handles a `keydown` event on the header.
	 * @param {!Event} event
	 * @protected
	 */
	handleKeydown_(event) {
		if (event.keyCode === 13 || event.keyCode === 32) {
			this.toggle(event.delegateTarget || event.currentTarget);
			event.preventDefault();
		}
	}

	/**
	 * Syncs the component according to the value of the `header` state,
	 * attaching events to the new element and detaching from any previous one.
	 */
	syncHeader() {
		this.headerEventHandler_.removeAllListeners();
		if (this.header) {
			if (core.isString(this.header)) {
				this.headerEventHandler_.add(
					dom.delegate(this.container, 'click', this.header, this.handleClick_.bind(this)),
					dom.delegate(this.container, 'keydown', this.header, this.handleKeydown_.bind(this))
				);
			} else {
				this.headerEventHandler_.add(
					dom.on(this.header, 'click', this.handleClick_.bind(this)),
					dom.on(this.header, 'keydown', this.handleKeydown_.bind(this))
				);
			}
		}
	}

	/**
	 * Toggles the content's visibility.
	 * @param {!Element} header
	 */
	toggle(header = this.header) {
		if (dom.hasClass(header, this.headerExpandedClasses)) {
			this.collapse(header);
		} else {
			this.expand(header);
		}
	}
}

/**
 * State configuration.
 */
Toggler.STATE = {
	/**
	 * The CSS classes added to the content when it's collapsed.
	 */
	collapsedClasses: {
		validator: core.isString,
		value: 'toggler-collapsed'
	},

	/**
	 * The element where the header/content selectors will be looked for.
	 * @type {string|!Element}
	 */
	container: {
		setter: dom.toElement,
		validator: value => core.isString(value) || core.isElement(value),
		value: document
	},

	/**
	 * The element that should be expanded/collapsed by this toggler.
	 * @type {string|!Element}
	 */
	content: {
		validator: value => core.isString(value) || core.isElement(value)
	},

	/**
	 * The CSS classes added to the content when it's expanded.
	 */
	expandedClasses: {
		validator: core.isString,
		value: 'toggler-expanded'
	},

	/**
	 * The element that should be trigger toggling.
	 * @type {string|!Element}
	 */
	header: {
		validator: value => core.isString(value) || core.isElement(value)
	},

	/**
	 * The CSS classes added to the header when the content is collapsed.
	 */
	headerCollapsedClasses: {
		validator: core.isString,
		value: 'toggler-header-collapsed'
	},

	/**
	 * The CSS classes added to the header when the content is expanded.
	 */
	headerExpandedClasses: {
		validator: core.isString,
		value: 'toggler-header-expanded'
	}
};

export default Toggler;
