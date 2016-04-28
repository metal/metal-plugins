'use strict';

import connect from '../src/connect';
import Component from 'metal-component';
import IncrementalDomRenderer from 'metal-incremental-dom';
import Provider from '../src/Provider';

describe('connect', function() {
	var OriginalComponent;
	var component;

	beforeEach(function() {
		class TestComponent extends Component {
			getRenderer() {
				var renderer = new IncrementalDomRenderer(this);
				renderer.renderIncDom = () => {
					IncrementalDOM.elementOpen('div');
					IncrementalDOM.text(this.config.foo);
					IncrementalDOM.elementClose('div');
				};
				return renderer;
			}
		}
		OriginalComponent = TestComponent;
		OriginalComponent.RENDERER = IncrementalDomRenderer;
	});

	afterEach(function() {
		if (component) {
			component.dispose();
		}
	});

	it('should return another component constructor when "connect" is called', function() {
		var TestComponent = connect()(OriginalComponent);
		assert.notStrictEqual(OriginalComponent, TestComponent);
	});

	it('should render the received component', function() {
		var TestComponent = connect()(OriginalComponent);
		component = new TestComponent({
			store: buildStoreStub()
		});

		var names = Object.keys(component.components);
		assert.strictEqual(1, names.length);

		var child = component.components[names[0]];
		assert.ok(child instanceof OriginalComponent);
		assert.strictEqual(component.element, child.element);
	});

	it('should pass any config data to the inner component', function() {
		var TestComponent = connect()(OriginalComponent);
		component = new TestComponent({
			foo: 'foo',
			store: buildStoreStub()
		});

		var names = Object.keys(component.components);
		var child = component.components[names[0]];
		assert.strictEqual('foo', child.config.foo);
	});

	describe('store', function() {
		it('should return the store being used', function() {
			var store = buildStoreStub();
			var TestComponent = connect()(OriginalComponent);
			component = new TestComponent({
				store
			});
			assert.strictEqual(store, component.getStore());
		});

		it('should throw error if no store is passed to wrapped component', function() {
			var TestComponent = connect()(OriginalComponent);
			assert.throws(() => component = new TestComponent());
		});

		it('should use store from Provider parent when there is one', function() {
			var store = buildStoreStub();
			var TestComponent = connect()(OriginalComponent);
			class MainComponent extends Component {
				createRenderer() {
					var renderer = new IncrementalDomRenderer(this);
					renderer.renderIncDom = function() {
						IncrementalDOM.elementOpen(Provider, null, [], 'store', store);
						IncrementalDOM.elementVoid(TestComponent, 'connect');
						IncrementalDOM.elementClose(Provider);
					};
					return renderer;
				}
			}

			component = new MainComponent();
			var child = component.components.connect;
			assert.strictEqual(store, child.getStore());
		});

		it('should subscribe to given store', function() {
			var store = buildStoreStub();
			var TestComponent = connect()(OriginalComponent);
			component = new TestComponent({
				store
			});
			assert.strictEqual(1, store.subscribe.callCount);
		});

		it('should unsubscribe to given store when detached', function() {
			var unsubscribe = sinon.stub();
			var store = buildStoreStub();
			store.subscribe.returns(unsubscribe);

			var TestComponent = connect()(OriginalComponent);
			component = new TestComponent({
				store
			});
			assert.strictEqual(0, unsubscribe.callCount);

			component.detach();
			assert.strictEqual(1, unsubscribe.callCount);
		});
	});

	describe('mapStoreStateToConfig', function() {
		it('should not pass anything from store state to inner component by default', function() {
			var store = buildStoreStub();
			store.getState.returns({
				foo: 'foo'
			});

			var TestComponent = connect()(OriginalComponent);
			component = new TestComponent({
				store
			});

			var names = Object.keys(component.components);
			var child = component.components[names[0]];
			assert.ok(!child.config.foo);
		});

		it('should pass data specified by "mapStoreStateToConfig" to inner component', function() {
			var store = buildStoreStub();
			store.getState.returns({
				foo: 'foo',
				bar: 'bar'
			});

			function mapDispatchToConfig(state) {
				return {
					foo: state.foo
				};
			}

			var TestComponent = connect(mapDispatchToConfig)(OriginalComponent);
			component = new TestComponent({
				store
			});

			var names = Object.keys(component.components);
			var child = component.components[names[0]];
			assert.strictEqual('foo', child.config.foo);
			assert.ok(!child.config.bar);
		});

		it('should update inner component when the store state it uses changes', function(done) {
			var store = buildStoreStub();
			store.getState.returns({
				foo: 'foo'
			});

			var TestComponent = connect(state => state)(OriginalComponent);
			component = new TestComponent({
				store
			});

			var names = Object.keys(component.components);
			var child = component.components[names[0]];
			assert.strictEqual('foo', child.config.foo);
			assert.strictEqual('foo', child.element.textContent);

			assert.strictEqual(1, store.subscribe.callCount);
			store.getState.returns({
				foo: 'bar'
			});
			store.subscribe.args[0][0]();

			component.once('stateSynced', function() {
				assert.strictEqual('bar', child.config.foo);
				assert.strictEqual('bar', child.element.textContent);
				done();
			});
		});

		it('should not update inner component when the store state it doesn\'t use changes', function(done) {
			var store = buildStoreStub();
			store.getState.returns({
				foo: 'foo',
				bar: 'bar'
			});

			var TestComponent = connect(({ foo }) => ({ foo }))(OriginalComponent);
			component = new TestComponent({
				store
			});

			var names = Object.keys(component.components);
			var child = component.components[names[0]];
			assert.strictEqual('foo', child.config.foo);
			assert.strictEqual('foo', child.element.textContent);

			assert.strictEqual(1, store.subscribe.callCount);
			store.getState.returns({
				foo: 'foo',
				bar: 'bar2'
			});
			store.subscribe.args[0][0]();

			component.once('stateSynced', function(data) {
				assert.ok(!data.changes.storeState);
				assert.strictEqual('foo', child.config.foo);
				assert.strictEqual('foo', child.element.textContent);
				done();
			});
		});
	});

	describe('mapDispatchToConfig', function() {
		it('should pass dispatch function from store to inner component by default', function() {
			var store = buildStoreStub();
			var TestComponent = connect()(OriginalComponent);
			component = new TestComponent({
				store
			});

			var names = Object.keys(component.components);
			var child = component.components[names[0]];
			assert.strictEqual(store.dispatch, child.config.dispatch);
		});

		it('should pass data specified by "mapDispatchToConfig" instead of dispatch function to inner component', function() {
			function mapDispatchToConfig(dispatch) {
				return {
					foo: () => dispatch('foo')
				};
			}
			var TestComponent = connect(null, mapDispatchToConfig)(OriginalComponent);
			component = new TestComponent({
				store: buildStoreStub()
			});

			var store = component.getStore();
			var names = Object.keys(component.components);
			var child = component.components[names[0]];
			assert.ok(!child.config.dispatch);
			assert.ok(child.config.foo);
			assert.strictEqual(0, store.dispatch.callCount);

			child.config.foo();
			assert.strictEqual(1, store.dispatch.callCount);
			assert.strictEqual('foo', store.dispatch.args[0][0]);
		});
	});
});

function buildStoreStub() {
	var store = {
		dispatch: sinon.stub(),
		getState: sinon.stub().returns({}),
		subscribe: sinon.stub().returns(sinon.stub())
	};
	return store;
}
