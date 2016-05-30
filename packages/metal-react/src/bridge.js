'use strict';

import { object } from 'metal';
import Component from 'metal-component';
import IncrementalDomRenderer from 'metal-incremental-dom';
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Creates a bridge component between Metal.js and React. This enables using
 * React components in Metal.js's environment.
 * @param {!function()} ReactComponent A React component's constructor
 * @return {!functon()} A metal component wrapping the given React one.
 */
export default function(ReactComponent) {
	class BridgeComponent extends Component {
		/**
		 * Returns the current instance for the react component.
		 */
		getInstance() {
			return this.instance_;
		}

		/**
		 * Renders this component, by letting react do its job inside a given
		 * container element. Passes all received config properties to the react
		 * component as props.
		 */
		render() {
			IncrementalDOM.elementOpen('div', null, [], 'class', 'metal-react-container');
			var element = IncrementalDOM.currentElement();
			IncrementalDOM.skip();
			IncrementalDOM.elementClose('div');

			var data = object.mixin({}, this.config);
			delete data.children;
			this.instance_ = ReactDOM.render(
			  React.createElement(ReactComponent, data),
			  element
			);
		}
	}
	BridgeComponent.RENDERER = IncrementalDomRenderer;
	return BridgeComponent;
}
