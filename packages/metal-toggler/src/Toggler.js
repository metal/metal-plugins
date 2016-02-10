'use strict';

import core from 'metal';
import dom from 'metal-dom';
import Attribute from 'metal-attribute';
import { EventHandler } from 'metal-events';

/**
 * Toggler component.
 */
class Toggler extends Attribute {
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

		content = header.querySelector(this.content);
		if (content) {
			return content;
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
	 * Syncs the component according to the value of the `header` attribute,
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
	 */
	toggle(header) {
		var content = this.getContentElement_(header);
		dom.toggleClasses(content, Toggler.CSS_EXPANDED);
		dom.toggleClasses(content, Toggler.CSS_COLLAPSED);

		if (dom.hasClass(content, Toggler.CSS_EXPANDED)) {
			dom.addClasses(header, Toggler.CSS_HEADER_EXPANDED);
			dom.removeClasses(header, Toggler.CSS_HEADER_COLLAPSED);
		} else {
			dom.removeClasses(header, Toggler.CSS_HEADER_EXPANDED);
			dom.addClasses(header, Toggler.CSS_HEADER_COLLAPSED);
		}
	}
}

/**
 * Attributes configuration.
 */
Toggler.ATTRS = {
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
	 * The element that should be trigger toggling.
	 * @type {string|!Element}
	 */
	header: {
		validator: value => core.isString(value) || core.isElement(value)
	}
};

/**
 * The CSS class added to the content when it's collapsed.
 */
Toggler.CSS_COLLAPSED = 'toggler-collapsed';

/**
 * The CSS class added to the content when it's expanded.
 */
Toggler.CSS_EXPANDED = 'toggler-expanded';

/**
 * The CSS class added to the header when the content is collapsed.
 */
Toggler.CSS_HEADER_COLLAPSED = 'toggler-header-collapsed';

/**
 * The CSS class added to the header when the content is expanded.
 */
Toggler.CSS_HEADER_EXPANDED = 'toggler-header-expanded';

export default Toggler;
