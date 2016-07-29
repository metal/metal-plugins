'use strict';

import Anim from 'metal-anim';
import dom from 'metal-dom';
import Component, { Config } from 'metal-jsx';

export const DELAY_TIME = 10;

/**
 * TransitionChild component
 */
class TransitionChild extends Component {
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
		this.transition_('appear');
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

				Anim.emulateTransitionEnd(node);
			},
			DELAY_TIME
		);
	}

	/**
	 * Handles `enter` type css transition.
	 */
	enter() {
		this.transition_('enter');
	}

	/**
	 * Handles `leave` type css transition.
	 * @param {function()} callback Function to run after transition.
	 */
	leave(callback) {
		this.transition_('leave', callback);
	}

	/**
	 * Handles adding the transition classname to the component element.
	 * @param {string} type Classname to apply to node.
	 * @param {function()} finishCallback Callback method to execute after transition.
	 * @protected
	 */
	transition_(type, finishCallback) {
		const node = this.element;

		const className = `${this.props.name}-${type}`;
		const activeClassName = `${className}-active`;

		const callback = () => {
			if (finishCallback) {
				finishCallback();
			} else {
				node.classList.remove(activeClassName, className);
			}
		};

		dom.once(node, 'transitionend', callback);

		node.classList.add(className);

		this.delayActive_(activeClassName, node);
	}

	/**
	 * @inheritDoc
	 */
	render() {
		return this.props.children[0];
	}
}

TransitionChild.PROPS = {
	/**
	 * Name of transition.
	 * @type {string}
	 */
	name: Config.string()
};

export default TransitionChild;