'use strict';

import Attribute from 'bower:metal/src/attribute/Attribute';

import core from 'bower:metal/src/core';
import dom from 'bower:metal/src/dom/dom';

class Clipboard extends Attribute {
	constructor(opt_config) {
		super(opt_config);

		dom.on(this.selector, 'click', (e) => this.initialize(e));
	}

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

Clipboard.ATTRS = {
	selector: {
		value: '[data-clipboard]',
		validator: core.isString
	}
};

class ClipboardAction extends Attribute {
	constructor(opt_config) {
		super(opt_config);

		if (this.text) {
			this.selectValue();
		}
		else if (this.target) {
			this.selectTarget();
		}
	}

	selectValue() {
		let fake = document.createElement('input');

		fake.style.position = 'absolute';
		fake.style.left = '-9999px';
		fake.value = this.text;
		this.selectedText = this.text;

		document.body.appendChild(fake);

		fake.select();
		this.copyText();

		document.body.removeChild(fake);
	}

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

	copyText() {
		let succeeded;

		try {
			succeeded = document.execCommand(this.action);
		}
		catch (err) {
			succeeded = false;
		}

		this.fireResult(succeeded);
		this.clearSelection();
	}

	fireResult(succeeded) {
		if (succeeded) {
			this.host.emit('success', {
				action: this.action,
				text: this.selectedText,
				trigger: this.trigger
			});
		}
		else {
			this.host.emit('error', `Cannot execute {$this.action} operation`);
		}
	}

	clearSelection() {
		if (this.target) {
			this.target.blur();
		}

		window.getSelection().removeAllRanges();
	}
}

ClipboardAction.ATTRS = {
	host: {
		validator: function(val) {
			return val instanceof Clipboard;
		}
	},
	action: {
		value: 'copy',
		validator: function(val) {
			return val === 'copy' || val === 'cut';
		}
	},
	target: {
		setter: function(val) {
			return document.getElementById(val);
		}
	},
	text: {
		validator: core.isString
	},
	trigger: {
		validator: core.isElement
	},
	selectedText: {
		validator: core.isString
	}
};

export default Clipboard;
