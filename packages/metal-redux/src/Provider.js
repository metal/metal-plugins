'use strict';

import IncrementalDomRenderer from 'metal-incremental-dom';
import JSXComponent from 'metal-jsx';

/**
 * Provides a redux store instance to all descendant components.
 */
class Provider extends JSXComponent {
	/**
	 * Defines the store as a child context, meaning that it will be passed down
	 * to all descendant components.
	 * @override
	 */
	getChildContext() {
		return {
			store: this.props.store
		};
	}

	/**
	 * Renders a wrapper element for the provider (since it's required by
	 * Metal.js), and its children inside it.
	 * @override
	 */
	render() {
		const {children} = this.props;
		if (children && children.length > 1) {
			return <span>{this.props.children}</span>;
		} else {
			return this.props.children;
		}
	}
}

export default Provider;
