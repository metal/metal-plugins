'use strict';

import { object } from 'metal';
import IncrementalDomRenderer from 'metal-incremental-dom';
import JSXComponent from 'metal-jsx';
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Creates a bridge component between Metal.js and React. This enables using
 * React components in Metal.js's environment.
 * @param {!function()} ReactComponent A React component's constructor
 * @return {!functon()} A metal component wrapping the given React one.
 */
export default function(ReactComponent) {
	class BridgeComponent extends JSXComponent {
		/**
		 * Returns the current instance for the react component.
		 */
		getInstance() {
			return this.instance_;
		}

		/**
		 * Unmounts the react component when disposed.
		 */
		disposed() {
			if (this.element) {
				ReactDOM.unmountComponentAtNode(this.element);
			}
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

			this.instance_ = ReactDOM.render(
				convertToReactElement(ReactComponent, this.props),
			  element
			);
		}
	}
	BridgeComponent.RENDERER = IncrementalDomRenderer;
	return BridgeComponent;
}

/**
 * Converts the given tag type and props object into a react element.
 * @param {string} tag
 * @param {!Object} props
 * @return {!ReactElement}
 */
function convertToReactElement(tag, props) {
	var data = object.mixin({}, props);
	var children = convertToReactElements(props.children);
	delete data.children;
	delete data.ref;
	return React.createElement(tag, data, children);
}

/**
 * Converts the given Metal.js children array into react elements.
 * @param {!Array<!Object>} children
 * @return {!Array<!ReactElement>}
 */
function convertToReactElements(children = []) {
	var elements = [];
	for (var i = 0; i < children.length; i++) {
		var element;
		if (children[i].tag) {
			element = convertToReactElement(children[i].tag, children[i].config);
		} else {
			element = children[i].text;
		}
		elements.push(element);
	}
	return elements;
}
