'use strict';

import JSXComponent from 'metal-jsx';
import Types from 'metal-state-validators';

export const DELAY_TIME = 10;

/**
 * TransitionChild component
 */
class TransitionChild extends JSXComponent {
	/**
	 * @inheritDoc
	 */
	created() {
		this.transition_ = this.transition_.bind(this);
	}

	/**
	 * Handles `appear` type css transition.
	 */
	appear() {
		this.transition_('appear', null, this.appearTimeout);
	}

	/**
	 * Handles adding the active class name after a short delay.
	 * @param {string} className Classname to apply to node.
	 * @param {!Object} node DOM node that class is applied to.
	 * @protected
	 */
	delayActive_(className, node) {
		setTimeout(
			() => {
				node.classList.add(className);
			},
			DELAY_TIME
		);
	}

	/**
	 * Handles `enter` type css transition.
	 */
	enter() {
		this.transition_('enter', null, this.enterTimeout);
	}

	/**
	 * Handles `leave` type css transition.
	 * @param {function()} callback Function to run after transition.
	 */
	leave(callback) {
		this.transition_('leave', callback, this.leaveTimeout);
	}

	/**
	 * Handles adding the transition classname to the component element.
	 * @param {string} type Classname to apply to node.
	 * @param {function()} finishCallback Callback method to execute after transition.
	 * @param {number} transitionLength Transition length in miliseconds.
	 * @protected
	 */
	transition_(type, finishCallback, transitionLength) {
		const node = this.element;

		const className = `${this.name}-${type}`;
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

		this.delayActive_(activeClassName, node);

		timeout = setTimeout(timeoutCallback, transitionLength);
	}

	/**
	 * @inheritDoc
	 */
	render() {
		return this.children[0];
	}
}

TransitionChild.STATE = {
	/**
	 * Length of appear transition.
	 * @type {number}
	 */
	appearTimeout: {
		validator: Types.number
	},

	/**
	* Length of enter transition.
	* @type {number}
	*/
	enterTimeout: {
		validator: Types.number
	},

	/**
	* Length of leave transition.
	* @type {number}
	*/
	leaveTimeout: {
		validator: Types.number
	},

	/**
	 * Name of transition.
	 * @type {string}
	 */
	name: {
		validator: Types.string
	}
};

export default TransitionChild;