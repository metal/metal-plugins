'use strict';

import Attribute from 'bower:metal/src/attribute/Attribute';
import core from 'bower:metal/src/core';
import dom from 'bower:metal/src/dom/dom';

/**
 * Clipboard component.
 */
class Clipboard extends Attribute {
	/**
	 * Delegates a click event to the passed selector.
	 */
	constructor(opt_config) {
		super(opt_config);

		dom.on(this.selector, 'click', (e) => this.initialize(e));
	}

	/**
	 * @inheritDoc
	 */
	disposeInterval() {
		super.disposeInterval();
	}

	/**
	 * Defines a new `ClipboardAction` on each click event.
	 * @param {!Event} e
	 */
	initialize(e) {
		new ClipboardAction({
			host    : this,
			action  : e.delegateTarget.getAttribute('data-action'),
			target  : e.delegateTarget.getAttribute('data-target'),
			text    : e.delegateTarget.getAttribute('data-text'),
			trigger : e.delegateTarget
		});
	}
}

/**
 * Attributes definition.
 * @type {!Object}
 * @static
 */
Clipboard.ATTRS = {
	selector: {
		value: '[data-clipboard]',
		validator: core.isString
	}
};

/**
 * ClipboardAction component.
 */
class ClipboardAction extends Attribute {
	/**
	 * Initializes selection either from a `text` or `target` attribute.
	 */
	constructor(opt_config) {
		super(opt_config);

		if (this.text) {
			this.selectValue();
		}
		else if (this.target) {
			this.selectTarget();
		}
	}

	/**
	 * @inheritDoc
	 */
	disposeInterval() {
		this.removeFakeElement();
		super.disposeInterval();
	}

	/**
	 * Selects the content from value passed on `text` attribute.
	 */
	selectValue() {
		this.removeFakeElement();
		this.removeFakeHandler = dom.once(document, 'click', this.removeFakeElement.bind(this));

		this.fake = document.createElement('input');
		this.fake.style.position = 'fixed';
		this.fake.style.left = '-9999px';
		this.fake.setAttribute('readonly', '');
		this.fake.value = this.text;
		this.selectedText = this.text;

		dom.enterDocument(this.fake);

		this.fake.select();
		this.copyText();
	}

	removeFakeElement() {
		if (this.fake) {
			dom.exitDocument(this.fake);
		}

		if (this.removeFakeHandler) {
			this.removeFakeHandler.removeListener();
		}
	}

	/**
	 * Selects the content from element passed on `target` attribute.
	 */
	selectTarget() {
		if (this.target.nodeName === 'INPUT' || this.target.nodeName === 'TEXTAREA') {
			this.target.select();
			this.selectedText = this.target.value;
		}
		else {
			let range = document.createRange();
			let selection = window.getSelection();

			range.selectNodeContents(this.target);
			selection.addRange(range);
			this.selectedText = selection.toString();
		}

		this.copyText();
	}

	/**
	 * Executes the copy operation based on the current selection.
	 */
	copyText() {
		let succeeded;

		try {
			succeeded = document.execCommand(this.action);
		}
		catch (err) {
			succeeded = false;
		}

		this.handleResult(succeeded);
	}

	/**
	 * Emits an event based on the copy operation result.
	 * @param {boolean} succeeded
	 */
	handleResult(succeeded) {
		if (succeeded) {
			this.host.emit('success', {
				action: this.action,
				text: this.selectedText,
				trigger: this.trigger,
				clearSelection: this.clearSelection.bind(this)
			});
		}
		else {
			this.host.emit('error', {
				action: this.action,
				trigger: this.trigger,
				clearSelection: this.clearSelection.bind(this)
			});
		}
	}

	/**
	 * Removes current selection and focus from `target` element.
	 */
	clearSelection() {
		if (this.target) {
			this.target.blur();
		}

		window.getSelection().removeAllRanges();
	}
}

/**
 * Attributes definition.
 * @type {!Object}
 * @static
 */
ClipboardAction.ATTRS = {
	/**
	 * A reference to the `Clipboard` base class.
	 * @type {Clipboard}
	 */
	host: {
		validator: function(val) {
			return val instanceof Clipboard;
		}
	},

	/**
	 * The action to be performed (either 'copy' or 'cut').
	 * @type {string}
	 * @default 'copy'
	 */
	action: {
		value: 'copy',
		validator: function(val) {
			return val === 'copy' || val === 'cut';
		}
	},

	/**
	 * The ID of an element that will be have its content copied.
	 * @type {string}
	 */
	target: {
		setter: function(val) {
			return document.getElementById(val);
		}
	},

	/**
	 * The text to be copied.
	 * @type {string}
	 */
	text: {
		validator: core.isString
	},

	/**
	 * The element that when clicked initiates a clipboard action.
	 * @type {Element}
	 */
	trigger: {
		validator: core.isElement
	},

	/**
	 * The text that is current selected.
	 * @type {string}
	 */
	selectedText: {
		validator: core.isString
	}
};

export default Clipboard;
