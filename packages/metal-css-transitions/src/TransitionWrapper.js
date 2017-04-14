'use strict';

import Component, {Config} from 'metal-jsx';

import TransitionChild from './TransitionChild';
import {getChildrenMap, mergeChildrenMap} from './utils';

/**
 * TransitionWrapper component
 */
class TransitionWrapper extends Component {
	/**
	 * @inheritDoc
	 */
	created() {
		this.state.childrenMap_ = getChildrenMap(this.props.children);

		this.handleChildrenEnter_ = this.handleChildrenEnter_.bind(this);
		this.handleChildrenLeave_ = this.handleChildrenLeave_.bind(this);
	}

	/**
	 * Executes the `appear` method on each child.
	 */
	attached() {
		if (this.props.children.length) {
			this._justAppeared = true;
		}

		this.props.children.forEach(child => {
			if (child && child.props) {
				const {key} = child.props;

				if (key && this.components[key]) {
					this.components[key].appear();
				}
			}
		});
	}

	/**
	 * Removes child from `childrenMap_`.
	 * @param {string|number} key The unique identifier of the child element that left.
	 * @protected
	 */
	finishLeave_(key) {
		const newChildrenMap = this.state.childrenMap_;

		newChildrenMap.delete(key);

		this.state.childrenMap_ = newChildrenMap;
	}

	/**
	 * Executes the `enter` method on each new entering child. However, these calls
	 * will be skipped if this is the first transition since `appear` was called.
	 * @param {!Array} newChildren Children elements that are entering.
	 * @param {!Object} prevKeyMap Map of children who are already present.
	 * @protected
	 */
	handleChildrenEnter_(newChildren, prevKeyMap) {
		if (this._justAppeared) {
			this._justAppeared = false;
			return;
		}

		newChildren.forEach(child => {
			if (child && child.props) {
				const {key} = child.props;

				if (key && !prevKeyMap.has(key) && this.components[key]) {
					this.components[key].enter();
				}
			}
		});
	}

	/**
	 * Executes the `leave` method on each child that leaves.
	 * @param {!Array} prevChildren Children who are already present.
	 * @param {!Object} newKeyMap Map of new children.
	 * @protected
	 */
	handleChildrenLeave_(prevChildren, newKeyMap) {
		prevChildren.forEach(child => {
			if (child && child.props) {
				const {key} = child.props;

				if (key && !newKeyMap.has(key) && this.components[key]) {
					this.components[key].leave(this.finishLeave_.bind(this, key));
				}
			}
		});
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

		const {childrenMap_} = this.state;

		childrenMap_.forEach(child => {
			if (child) {
				children.push(child);
			}
		});

		return (
			<span>
				{!!children.length &&
					children.map(child => (
						<TransitionChild name={this.props.name} ref={child.props.key}>
							{child}
						</TransitionChild>
					))}
			</span>
		);
	}
}

TransitionWrapper.PROPS = {
	/**
	 * Name of css transition.
	 * @type {string}
	 */
	name: Config.string()
};

TransitionWrapper.STATE = {
	/**
	 * Map of each child to its corresponding key value.
	 * @type {object}
	 * @default {}
	 * @protected
	 */
	childrenMap_: Config.value({})
};

export default TransitionWrapper;
