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
			trigger : e.delegateTarget,
			target  : e.delegateTarget.getAttribute('data-target')
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

		this.select();
	}

	select() {
		this.target.select();
		this.selectedText = this.target.value;

		this.copy();
	}

	copy() {
		let succeeded;

		try {
			succeeded = document.execCommand('copy');
		}
		catch (err) {
			succeeded = false;
		}

		this.clearSelection();
	}

	clearSelection() {
		this.target.blur();
		window.getSelection().removeAllRanges();
	}
}

ClipboardAction.ATTRS = {
	target: {
		setter: function(val) {
			return document.getElementById(val);
		},
		validator: function(val) {
			let target = document.getElementById(val);
			return target.nodeName === 'INPUT' || target.nodeName === 'TEXTAREA';
		}
	},
	selectedText: {
		validator: core.isString
	}
};

export default Clipboard;
