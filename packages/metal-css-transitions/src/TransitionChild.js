'use strict';

import JSXComponent from 'metal-jsx';
import Types from 'metal-state-validators';

export const DELAY_TIME = 10;

class TransitionChild extends JSXComponent {
	created() {
		this.transition = this.transition.bind(this);
	}

	appear() {
		this.transition('appear', null, this.appearTimeout);
	}

	delayActive(className, node) {
		setTimeout(
			() => {
				node.classList.add(className);
			},
			DELAY_TIME
		);
	}

	enter() {
		this.transition('enter', null, this.enterTimeout);
	}

	leave(callback) {
		this.transition('leave', callback, this.leaveTimeout);
	}

	transition(type, finishCallback, animationLength) {
		const node = this.element;

		const className = `${this.transitionName}-${type}`;
		const activeClassName = `${className}-active`;

		let timeout = null;

		const timeoutCallback = () => {
			clearTimeout(timeout);

			node.classList.remove(activeClassName, className);

			if (finishCallback) {
				finishCallback();
			}
		};

		node.classList.add(className);

		this.delayActive(activeClassName, node);

		timeout = setTimeout(timeoutCallback, animationLength);
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