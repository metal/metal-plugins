'use strict';

import bridge from '../src/bridge';
import dom from 'metal-dom';
import Component from 'metal-component';
import IncrementalDomRenderer from 'metal-incremental-dom';
import React from 'react';
import ReactDOM from 'react-dom';

class HelloReactComponent extends React.Component {
	render() {
		return React.createElement(
			'div',
			{
				className: 'react-comp'
			},
			'Hello ',
			this.props.name ? this.props.name : 'World'
		);
	}
}

describe('bridge', function() {
	var component;

	afterEach(function() {
		if (component) {
			component.dispose();
		}
	});

	it('should render react component inside container', function() {
		var HelloComponent = bridge(HelloReactComponent);
		component = new HelloComponent();

		assert.ok(dom.hasClass(component.element, 'metal-react-container'));
		assert.strictEqual(1, component.element.childNodes.length);

		var reactEl = component.element.childNodes[0];
		assert.ok(dom.hasClass(reactEl, 'react-comp'));
		assert.strictEqual('Hello World', reactEl.textContent);
	});

	it('should pass config as props', function() {
		var HelloComponent = bridge(HelloReactComponent);
		component = new HelloComponent({
			name: 'John Doe'
		});

		assert.ok(dom.hasClass(component.element, 'metal-react-container'));
		assert.strictEqual(1, component.element.childNodes.length);

		var reactEl = component.element.childNodes[0];
		assert.ok(dom.hasClass(reactEl, 'react-comp'));
		assert.strictEqual('Hello John Doe', reactEl.textContent);
	});

	it('should unmount react component on dispose', function() {
		var unmounted = false;
		class UnmountedReactComponent extends React.Component {
			componentWillUnmount() {
				unmounted = true;
			}

			render() {
				return React.createElement('div');
			}
		}

		var UnmountedComponent = bridge(UnmountedReactComponent);
		component = new UnmountedComponent();
		assert.ok(!unmounted);

		component.dispose();
		assert.ok(unmounted);
	});

	it('should not throw error when disposing unreredered component', function() {
		class UnmountedReactComponent extends React.Component {
			render() {
				return React.createElement('div');
			}
		}

		var UnmountedComponent = bridge(UnmountedReactComponent);
		component = new UnmountedComponent({}, false);
		assert.doesNotThrow(() => component.dispose());
	});

	it('should return instance from getInstance function', function() {
		var HelloComponent = bridge(HelloReactComponent);
		component = new HelloComponent();
		assert.ok(component.getInstance() instanceof React.Component);
	});

	it('should pass Metal.js children as react elements', function() {
		class ChildrenReactComponent extends React.Component {
			render() {
				return React.createElement(
					'div',
					{
						className: 'children-comp'
					},
					this.props.children
				);
			}
		}
		var ChildrenComponent = bridge(ChildrenReactComponent);

		class TestComponent extends Component {
			render() {
				IncrementalDOM.elementOpen(ChildrenComponent);
				IncrementalDOM.elementOpen('div', null, null, 'data-foo', 'bar');
				IncrementalDOM.text('Hello World');
				IncrementalDOM.elementClose('div');
				IncrementalDOM.elementClose(ChildrenComponent);
			}
		}
		TestComponent.RENDERER = IncrementalDomRenderer;

		component = new TestComponent();

		assert.ok(dom.hasClass(component.element, 'metal-react-container'));
		assert.strictEqual(1, component.element.childNodes.length);

		var reactEl = component.element.childNodes[0];
		assert.ok(dom.hasClass(reactEl, 'children-comp'));
		assert.strictEqual(1, reactEl.childNodes.length);
		assert.strictEqual('DIV', reactEl.childNodes[0].tagName);
		assert.strictEqual('bar', reactEl.childNodes[0].getAttribute('data-foo'));
		assert.strictEqual('Hello World', reactEl.childNodes[0].textContent);
	});
});
