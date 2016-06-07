'use strict';

import JSXComponent from 'metal-jsx';
import Types from 'metal-state-validators';

import TransitionChild from './TransitionChild';

function getChildrenMap(children) {
	const retObj = {};

	children.forEach(
		child => {
			if (child && child.config) {
				retObj[child.config.key] = child;
			}
		}
	);

	return retObj;
}

function mergeChildrenMap(next = {}, prev = {}) {
	function getValueForKey(key) {
		if (next.hasOwnProperty(key)) {
			return next[key];
		} else {
			return prev[key];
		}
	}

	const nextKeysPending = {};

	let pendingKeys = [];

	for (let prevKey in prev) {
		if (next.hasOwnProperty(prevKey)) {
			if (pendingKeys.length) {
				nextKeysPending[prevKey] = pendingKeys;

				pendingKeys = [];
			}
		} else {
			pendingKeys.push(prevKey);
		}
	}

	const mergedMap = {};

	for (let nextKey in next) {
		if (nextKeysPending.hasOwnProperty(nextKey)) {
			for (let i = 0; i < nextKeysPending[nextKey].length; i++) {
				const pendingNextKey = nextKeysPending[nextKey][i];

				mergedMap[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
			}
		}

		mergedMap[nextKey] = getValueForKey(nextKey);
	}

	for (let i = 0; i < pendingKeys.length; i++) {
		mergedMap[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
	}

	return mergedMap;
}

class TransitionWrapper extends JSXComponent {
	created() {
		this._childrenMap = getChildrenMap(this.children);
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

	syncChildren(newChildren = [], prevChildren = []) {
		const newKeyMap = getChildrenMap(newChildren);
		const prevKeyMap = getChildrenMap(prevChildren);

		this.setState(
			{
				_childrenMap: mergeChildrenMap(newKeyMap, prevKeyMap)
			},
			() => {
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
		);
	}

	finishLeave(key) {
		const newChildrenMap = this._childrenMap;

		delete newChildrenMap[key];

		this._childrenMap = newChildrenMap;
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
				{
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