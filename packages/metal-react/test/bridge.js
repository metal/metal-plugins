'use strict';

import bridge from '../src/bridge';
import dom from 'metal-dom';
import React from 'react';
import ReactDOM from 'react-dom';

describe('bridge', function() {
	var component;
	var ReactComponent = () => {};

	beforeEach(function() {
		sinon.spy(React, 'createElement');
		sinon.stub(ReactDOM, 'render');
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
});
