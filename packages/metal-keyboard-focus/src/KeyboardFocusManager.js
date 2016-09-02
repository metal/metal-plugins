'use strict';

import { core, Disposable } from 'metal';

/**
 * Listens to keyboard events and uses them to move focus between different
 * elements from a component (via the arrow keys for example).
 * By default `KeyboardFocusManager` will assume that all focusable elements
 * in the component will have refs that follow the pattern "el<position>", where
 * "position" is a number. The arrow keys will then automatically move between
 * elements by incrementing/decrementing the position.
 * It's possible to fully customize this behavior by passing a function to
 * `setFocusHandler`. For more details check this function's docs.
 */
class KeyboardFocusManager extends Disposable {
	/**
	 * Constructor for `KeyboardFocusManager`.
	 * @param {!Component} component
	 * @param {string=} opt_selector
	 */
	constructor(component, opt_selector) {
		super();
		this.component_ = component;
		this.selector_ = opt_selector || '*';
		this.handleKey_ = this.handleKey_.bind(this);
	}

	/**
	 * Builds a ref string for the given position.
	 * @param {number|string} position
	 * @return {string}
	 * @protected
	 */
	buildRef_(position) {
		return 'el' + position;
	}

	/**
	 * @inheritDoc
	 */
	disposeInternal() {
		super.disposeInternal();
		this.stop();
		this.component_ = null;
		this.selector_ = null;
	}

	/**
	 * Gets the position of the given element, according to its ref.
	 * @param {!Element} element
	 * @return {?number}
	 * @protected
	 */
	getElementPosition_(element) {
		const ref = element.getAttribute('ref');
		if (ref) {
			return parseInt(ref.substr(2), 10);
		}
	}

	/**
	 * Gets the next focusable element, that is, the next element that doesn't
	 * have the `data-unfocusable` attribute set to `true`.
	 * @param {number} position
	 * @param {number} increment
	 * @return {Element}
	 * @protected
	 */
	getNextFocusable_(position, increment) {
		let element;
		do {
			position += increment;
			element = this.component_.refs[this.buildRef_(position)];
		} while (element && element.getAttribute('data-unfocusable') === 'true');
		return element;
	}

	/**
	 * Handles a `keyup` event. Decides if a new element should be focused
	 * according to the key that was pressed.
	 * @param {!Event} event
	 * @protected
	 */
	handleKey_(event) {
		let element = this.focusHandler_ && this.focusHandler_(event);
		if (!this.focusHandler_ || element === true) {
			element = this.handleKeyDefault_(event.keyCode);
		}
		if (!core.isElement(element)) {
			element = this.component_.refs[element];
		}
		if (element) {
			element.focus();
		}
	}

	/**
	 * Handles a key press according to the default behavior. Assumes that all
	 * focusable elements in the component will have refs that follow the pattern
	 * "el<position>", where "position" is a number. The arrow keys will then
	 * automatically move between elements by incrementing/decrementing the
	 * position.
	 * @param {number} keyCode
	 * @protected
	 */
	handleKeyDefault_(keyCode) {
		let position = this.getElementPosition_(event.delegateTarget);
		if (!core.isDefAndNotNull(position)) {
			return;
		}

		switch (keyCode) {
			case 37:
			case 38:
				// Left/up arrow keys will focus the previous element.
				return this.getNextFocusable_(position, -1);
			case 39:
			case 40:
				// Right/down arrow keys will focus the next element.
				return this.getNextFocusable_(position, 1);
		}
	}

	/**
	 * Sets a handler function that will be called to decide which element should
	 * be focused according to the key that was pressed. It will receive the key
	 * event and should return one of the following:
	 *   - `true`, if the default behavior should be triggered instead.
	 *   - A string, representing a `ref` to the component element that should be
	 *       focused.
	 *   - The element itself that should be focused.
	 *   - Anything else, if nothing should be focused (skipping default behavior
	 *       too).
	 * @param {function(key: string)} focusHandler
	 * @chainable
	 */
	setFocusHandler(focusHandler) {
		this.focusHandler_ = focusHandler;
		return this;
	}

	/**
	 * Starts listening to keyboard events and handling element focus.
	 * @chainable
	 */
	start() {
		if (!this.handle_) {
			this.handle_ = this.component_.delegate(
				'keyup',
				this.selector_,
				this.handleKey_
			);
		}
		return this;
	}

	/**
	 * Stops listening to keyboard events and handling element focus.
	 * @chainable
	 */
	stop() {
		if (this.handle_) {
			this.handle_.removeListener();
			this.handle_ = null;
		}
		return this;
	}
}

export default KeyboardFocusManager;
