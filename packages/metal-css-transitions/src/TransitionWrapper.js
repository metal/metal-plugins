'use strict';

import JSXComponent from 'metal-jsx';
import Types from 'metal-state-validators';

import TransitionChild from './TransitionChild';
import {getChildrenMap, mergeChildrenMap} from './utils';

class TransitionWrapper extends JSXComponent {
	created() {
		this._childrenMap = getChildrenMap(this.children);

		this.handleChildrenEnter = this.handleChildrenEnter.bind(this);
		this.handleChildrenLeave = this.handleChildrenLeave.bind(this);
	}

	attached() {
		this.children.forEach(
			child => {
				if (child && child.config) {
					const {key} = child.config;

					this.components[key].appear();
				}
			}
		);
	}

	finishLeave(key) {
		const newChildrenMap = this._childrenMap;

		delete newChildrenMap[key];

		this._childrenMap = newChildrenMap;
	}

	handleChildrenEnter(newChildren, prevKeyMap) {
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

	handleChildrenLeave(prevChildren, newKeyMap) {
		prevChildren.forEach(
			child => {
				if (child && child.config) {
					const {key} = child.config;

					if (key && !newKeyMap[key]) {
						this.components[key].leave(this.finishLeave.bind(this, key));
					}
				}
			}
		);
	}

	syncChildren(newChildren, prevChildren = []) {
		const newKeyMap = getChildrenMap(newChildren);
		const prevKeyMap = getChildrenMap(prevChildren);

		this.setState(
			{
				_childrenMap: mergeChildrenMap(newKeyMap, prevKeyMap)
			},
			() => {
				this.handleChildrenEnter(newChildren, prevKeyMap);
				this.handleChildrenLeave(prevChildren, newKeyMap);
			}
		);
	}

	render() {
		const children = [];

		for (let key in this._childrenMap) {
			const child = this._childrenMap[key];

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
	name: {
		validator: Types.string
	},

	enterTimeout: {
		validator: Types.number
	},

	leaveTimeout: {
		validator: Types.number
	},

	appearTimeout: {
		validator: Types.number
	},

	_childrenMap: {
		value: {}
	}
}

export default TransitionWrapper;