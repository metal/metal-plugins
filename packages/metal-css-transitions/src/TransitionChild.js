'use strict';

import JSXComponent from 'metal-jsx';
import Types from 'metal-state-validators';

import CSSUtil from './CSSUtil';

export const DELAY_TIME = 10;

class TransitionChild extends JSXComponent {
	created() {
		this.transition = this.transition.bind(this);
	}

	transition(type, finishCallback, animationLength) {
		var node = this.element;

		const className = ` ${this.transitionName}-${type}`;
		const activeClassName = ` ${className}-active`;

		let timeout = null;

		const timeoutCallback = () => {
			clearTimeout(timeout);

			CSSUtil.removeClass(node, activeClassName);
			CSSUtil.removeClass(node, className);

			if (finishCallback) {
				finishCallback();
			}
		};

		CSSUtil.addClass(node, className);

		this.delayActive(activeClassName, node);

		timeout = setTimeout(timeoutCallback, animationLength);
	}

	delayActive(className, node) {
		setTimeout(
			() => {
				CSSUtil.addClass(node, className);
			},
			DELAY_TIME
		);
	}

	appear() {
		this.transition('appear', null, this.appearTimeout);
	}

	enter() {
		this.transition('enter', null, this.enterTimeout);
	}

	leave(callback) {
		this.transition('leave', callback, this.leaveTimeout);
	}

	render() {
		return this.children[0];
	}
}

TransitionChild.STATE = {
	appearTimeout: {
		validator: Types.number
	},

	transitionName: {
		validator: Types.string
	},

	enterTimeout: {
		validator: Types.number
	},

	leaveTimeout: {
		validator: Types.number
	}
};

export default TransitionChild;