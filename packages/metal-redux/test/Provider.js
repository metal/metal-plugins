'use strict';

import Component from 'metal-component';
import IncrementalDomRenderer from 'metal-incremental-dom';
import Provider from '../src/Provider';

describe('Provider', function() {
	var ChildComponent;
	var component;

	beforeEach(function() {
		ChildComponent = createTestComponentClass();
		ChildComponent.RENDERER.renderIncDom = function() {
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

	it('should render a single child received', function() {
		var TestComponent = createTestComponentClass();
		TestComponent.RENDERER.renderIncDom = function() {
			IncrementalDOM.elementOpen(Provider, null, null, 'ref', 'provider');
			IncrementalDOM.elementVoid(ChildComponent, null, null, 'ref', 'child');
			IncrementalDOM.elementClose(Provider);
		};

		component = new TestComponent();
		var provider = component.components.provider;
		var child = component.components.child;

		assert.ok(provider);
		assert.ok(child);
		assert.strictEqual(provider.element, component.element);
		assert.strictEqual(1, provider.element.childNodes.length);
		assert.strictEqual(child.element, provider.element);
		assert.strictEqual('CHILD', provider.element.tagName);
		assert.strictEqual('CHILD', child.element.tagName);
		assert.strictEqual('Child', child.element.textContent);
	});

	it('should render multiple children received and wrap with a span', function() {
		var TestComponent = createTestComponentClass();
		TestComponent.RENDERER.renderIncDom = function() {
			IncrementalDOM.elementOpen(Provider, null, null, 'ref', 'provider');
			IncrementalDOM.elementVoid(ChildComponent, null, null, 'ref', 'child');
			IncrementalDOM.elementVoid(ChildComponent, null, null, 'ref', 'child2');
			IncrementalDOM.elementClose(Provider);
		};

		component = new TestComponent();
		var provider = component.components.provider;
		var child = component.components.child;
		var child2 = component.components.child2;

		assert.ok(provider);
		assert.ok(child);
		assert.ok(child2);
		assert.strictEqual(2, provider.element.childNodes.length);
		assert.strictEqual('SPAN', provider.element.tagName);
		assert.strictEqual('Child', child.element.textContent);
		assert.strictEqual('Child', child2.element.textContent);
	});

	it('should pass store object down to children as context', function() {
		var store = {};
		var TestComponent = createTestComponentClass();
		TestComponent.RENDERER.renderIncDom = function() {
			IncrementalDOM.elementOpen(Provider, null, null, 'ref', 'provider', 'store', store);
			IncrementalDOM.elementVoid(ChildComponent, null, null, 'ref', 'child');
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
		class TestRenderer extends IncrementalDomRenderer.constructor {
		}
		return new TestRenderer();
	}
});
