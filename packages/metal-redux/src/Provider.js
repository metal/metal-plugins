'use strict';

import Component from 'metal-component';
import IncrementalDomRenderer from 'metal-incremental-dom';

/**
 * Provides a redux store instance to all descendant components.
 */
class Provider extends Component {
	/**
	 * Defines the store as a child context, meaning that it will be passed down
	 * to all descendant components.
	 * @override
	 */
	getChildContext() {
		return {
			store: this.config.store
		};
	}
}

/**
 * The renderer used by `Provider`.
 */
class ProviderRenderer extends IncrementalDomRenderer {
	/**
	 * Renders a wrapper element for the provider (since it's required by
	 * Metal.js), and its children inside it.
	 * @override
	 */
	renderIncDom() {
		this.component_.config.children.forEach(IncrementalDomRenderer.renderChild);
	}
}

Provider.RENDERER = ProviderRenderer;

export default Provider;
