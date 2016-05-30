'use strict';

import bridge from '../src/bridge';
import dom from 'metal-dom';
import Component from 'metal-component';
import IncrementalDomRenderer from 'metal-incremental-dom';
import React from 'react';
import ReactDOM from 'react-dom';

describe('bridge', function() {
	var component;
	var ReactComponent = () => {};

	beforeEach(function() {
		sinon.spy(React, 'createElement');
		sinon.stub(ReactDOM, 'render').returns('instance');
	});

	afterEach(function() {
		if (component) {
			component.dispose();
		}
		React.createElement.restore();
		ReactDOM.render.restore();
	});

	it('should render react component inside container', function() {
		var BridgeComponent = bridge(ReactComponent);
		component = new BridgeComponent();

		assert.ok(dom.hasClass(component.element, 'metal-react-container'));
		assert.strictEqual(1, React.createElement.callCount);
		assert.strictEqual(ReactComponent, React.createElement.args[0][0]);
		assert.strictEqual(1, ReactDOM.render.callCount);
		assert.strictEqual(component.element, ReactDOM.render.args[0][1]);
	});

	it('should pass config as props', function() {
		var BridgeComponent = bridge(ReactComponent);
		var config = {
			foo: 'fooValue',
			bar: 'barValue'
		};
		component = new BridgeComponent(config);

		assert.deepEqual(config, React.createElement.args[0][1]);
	});

	it('should return instance from getInstance function', function() {
		var BridgeComponent = bridge(ReactComponent);
		component = new BridgeComponent();
		assert.strictEqual('instance', component.getInstance());
	});

	it('should pass Metal.js children as react elements', function() {
		var BridgeComponent = bridge(ReactComponent);

		class TestComponent extends BridgeComponent {
			render() {
				IncrementalDOM.elementOpen(BridgeComponent);
				IncrementalDOM.elementOpen('div', null, null, 'foo', 'bar');
				IncrementalDOM.text('Hello World');
				IncrementalDOM.elementClose('div');
				IncrementalDOM.elementClose(BridgeComponent);
			}
		}
		TestComponent.RENDERER = IncrementalDomRenderer;

		component = new TestComponent();
		assert.strictEqual(1, ReactDOM.render.callCount);

		var element = ReactDOM.render.args[0][0];
		var children = element.props.children;
		assert.ok(Array.isArray(children));
		assert.strictEqual(1, children.length);
		assert.strictEqual('div', children[0].type);
		assert.strictEqual('bar', children[0].props.foo);
		assert.strictEqual(1, children[0].props.children.length);
		assert.strictEqual('Hello World', children[0].props.children[0]);
	});
});
