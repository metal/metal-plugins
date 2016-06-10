'use strict';

import JSXComponent from 'metal-jsx';
import Types from 'metal-state-validators';

import TransitionChild from './TransitionChild';
import {getChildrenMap, mergeChildrenMap} from './utils';

/**
 * TransitionWrapper component
 */
class TransitionWrapper extends JSXComponent {
	/**
	 * @inheritDoc
	 */
	created() {
		this.childrenMap_ = getChildrenMap(this.children);

		this.handleChildrenEnter_ = this.handleChildrenEnter_.bind(this);
		this.handleChildrenLeave_ = this.handleChildrenLeave_.bind(this);
	}

	/**
	 * Executes the `appear` method on each child.
	 */
	attached() {
		this.children.forEach(
			child => {
				if (child && child.config) {
					const {key} = child.config;

					if (key) {
						this.components[key].appear();
					}
				}
			}
		);
	}

	/**
	 * Removes child from `childrenMap_`.
	 * @param {string|number} key The unique identifier of the child element that left.
	 * @protected
	 */
	finishLeave_(key) {
		const newChildrenMap = this.childrenMap_;

		delete newChildrenMap[key];

		this.childrenMap_ = newChildrenMap;
	}

	/**
	 * Executes the `enter` method on each new entering child.
	 * @param {!Array} newChildren Children elements that are entering.
	 * @param {!Object} prevKeyMap Map of children who are already present.
	 * @protected
	 */
	handleChildrenEnter_(newChildren, prevKeyMap) {
		newChildren.forEach(
			child => {
				if (child && child.config) {
					const {key} = child.config;

					if (key && !prevKeyMap[key]) {
						this.components[key].enter();
					}
				}
			}
		);
	}

	/**
	 * Executes the `leave` method on each child that leaves.
	 * @param {!Array} prevChildren Children who are already present.
	 * @param {!Object} newKeyMap Map of new children.
	 * @protected
	 */
	handleChildrenLeave_(prevChildren, newKeyMap) {
		prevChildren.forEach(
			child => {
				if (child && child.config) {
					const {key} = child.config;

					if (key && !newKeyMap[key]) {
						this.components[key].leave(this.finishLeave_.bind(this, key));
					}
				}
			}
		);
	}

	/**
	 * Sorts children, creates new `childrenMap_` and passes them to
	 * `handleChildrenEnter_` and `handleChildrenLeave_`.
	 * @param {!Array} newChildren New children elements.
	 * @param {!Array} prevChildren Previous children elements.
	 */
	syncChildren(newChildren, prevChildren = []) {
		const newKeyMap = getChildrenMap(newChildren);
		const prevKeyMap = getChildrenMap(prevChildren);

		this.setState(
			{
				childrenMap_: mergeChildrenMap(newKeyMap, prevKeyMap)
			},
			() => {
				this.handleChildrenEnter_(newChildren, prevKeyMap);
				this.handleChildrenLeave_(prevChildren, newKeyMap);
			}
		);
	}

	/**
	 * @inheritDoc
	 */
	render() {
		const children = [];

		for (let key in this.childrenMap_) {
			const child = this.childrenMap_[key];

			if (child) {
				children.push(child);
			}
		}

		return (
			<span>
				{!!children.length &&
					children.map(
						child => {
							return (
								<TransitionChild appearTimeout={this.appearTimeout} enterTimeout={this.enterTimeout} leaveTimeout={this.leaveTimeout} ref={child.config.key} transitionName={this.name}>
									{child}
								</TransitionChild>
							)
						}
					)
				}
			</span>
		);
	}
}

TransitionWrapper.STATE = {
	/**
	 * Length of appear transition.
	 * @type {number}
	 * @default 0
	 */
	appearTimeout: {
		validator: Types.number,
		value: 0
	},

	/**
	 * Map of each child to its corresponding key value.
	 * @type {object}
	 * @default {}
	 * @protected
	 */
	childrenMap_: {
		value: {}
	},

	/**
	 * Length of enter transition.
	 * @type {number}
	 * @default 0
	 */
	enterTimeout: {
		validator: Types.number,
		value: 0
	},

	/**
	 * Length of leave transition.
	 * @type {number}
	 * @default 0
	 */
	leaveTimeout: {
		validator: Types.number,
		value: 0
	},

	/**
	 * Name of css transition.
	 * @type {string}
	 */
	name: {
		validator: Types.string
	}
}

export default TransitionWrapper;