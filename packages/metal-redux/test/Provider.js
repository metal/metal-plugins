'use strict';

import Component from 'metal-component';
import IncrementalDomRenderer from 'metal-incremental-dom';
import Provider from '../src/Provider';

describe('Provider', function() {
	var ChildComponent;
	var component;

	beforeEach(function() {
		ChildComponent = createTestComponentClass();
		ChildComponent.RENDERER.prototype.renderIncDom = function() {
			IncrementalDOM.elementOpen('child');
			IncrementalDOM.text('Child');
			IncrementalDOM.elementClose('child');
		};
	});

	afterEach(function() {
		if (component) {
			component.dispose();
		}
	});

	it('should render the children received', function() {
		var TestComponent = createTestComponentClass();
		TestComponent.RENDERER.prototype.renderIncDom = function() {
			IncrementalDOM.elementOpen(Provider, 'provider');
			IncrementalDOM.elementVoid(ChildComponent, 'child');
			IncrementalDOM.elementClose(Provider);
		};

		component = new TestComponent();
		var provider = component.components.provider;
		var child = component.components.child;
		assert.ok(provider);
		assert.ok(child);
		assert.strictEqual(provider.element, component.element);
		assert.strictEqual(child.element, provider.element);
		assert.strictEqual(1, component.element.childNodes.length);
		assert.strictEqual('CHILD', component.element.tagName);
		assert.strictEqual('Child', component.element.textContent);
	});

	it('should pass store object down to children as context', function() {
		var store = {};
		var TestComponent = createTestComponentClass();
		TestComponent.RENDERER.prototype.renderIncDom = function() {
			IncrementalDOM.elementOpen(Provider, 'provider', ['store', store]);
			IncrementalDOM.elementVoid(ChildComponent, 'child');
			IncrementalDOM.elementClose(Provider);
		};

		component = new TestComponent();
		var provider = component.components.provider;
		var child = component.components.child;
		assert.ok(!component.context.store);
		assert.ok(!provider.context.store);
		assert.strictEqual(store, child.context.store);
	});

	function createTestComponentClass(opt_renderer) {
		class TestComponent extends Component {
		}
		TestComponent.RENDERER = opt_renderer || createIncrementalDomRenderer();
		return TestComponent;
	}

	function createIncrementalDomRenderer() {
		class TestRenderer extends IncrementalDomRenderer {
		}
		return TestRenderer;
	}
});
