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
			render() {
				IncrementalDOM.elementOpen('div');
				IncrementalDOM.text(this.config.foo);
				IncrementalDOM.elementClose('div');
			}
		}
		TestComponent.RENDERER = IncrementalDomRenderer;
		OriginalComponent = TestComponent;
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
						IncrementalDOM.elementVoid(TestComponent, null, null, 'ref', 'connect');
						IncrementalDOM.elementClose(Provider);
					};
					return renderer;
				}
			}

			component = new MainComponent();
			var child = component.components.connect;
			assert.strictEqual(store, child.getStore());
		});

		it('should not subscribe to given store by default', function() {
			var store = buildStoreStub();
			var TestComponent = connect()(OriginalComponent);
			component = new TestComponent({
				store
			});
			assert.strictEqual(0, store.subscribe.callCount);
		});

		it('should not throw error when detaching and no "mapStoreStateToConfig" was given', function() {
			var TestComponent = connect()(OriginalComponent);
			component = new TestComponent({
				store: buildStoreStub()
			});
			assert.doesNotThrow(() => component.detach());
		});

		it('should subscribe to given store if "mapStoreStateToConfig" is given', function() {
			var store = buildStoreStub();
			var TestComponent = connect(sinon.stub())(OriginalComponent);
			component = new TestComponent({
				store
			});
			assert.strictEqual(1, store.subscribe.callCount);
		});

		it('should unsubscribe to given store when detached if "mapStoreStateToConfig"', function() {
			var unsubscribe = sinon.stub();
			var store = buildStoreStub();
			store.subscribe.returns(unsubscribe);

			var TestComponent = connect(sinon.stub())(OriginalComponent);
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
			sinon.spy(child, 'render');
			assert.strictEqual('foo', child.config.foo);
			assert.strictEqual('foo', child.element.textContent);

			assert.strictEqual(1, store.subscribe.callCount);
			store.getState.returns({
				foo: 'foo',
				bar: 'bar2'
			});
			store.subscribe.args[0][0]();

			component.once('stateSynced', function(data) {
				assert.ok(!child.render.called);
				assert.strictEqual('foo', child.config.foo);
				assert.strictEqual('foo', child.element.textContent);
				done();
			});
		});

		it('should subscribe parent components to store before child components', function() {
			var store = buildStoreStub();
			store.getState.returns({
				foo: 'foo'
			});

			var ChildComponent = connect(state => state)(OriginalComponent);
			class ParentComponent extends Component {
				render() {
					IncrementalDOM.elementVoid(
						ChildComponent,
						null,
						null,
						'store',
						this.config.store
					);
				}
			}
			ParentComponent.RENDERER = IncrementalDomRenderer;
			var TestComponent = connect(state => state)(ParentComponent);

			component = new TestComponent({
				store
			});
			store.getState.returns({
				foo: 'bar'
			});
			assert.strictEqual(2, store.subscribe.callCount);

			store.subscribe.args[0][0]();
			assert.strictEqual(store.getState(), component.storeState);
		});

		it('should receive store state and component config in "mapStoreStateToConfig"', function() {
			var store = buildStoreStub();
			var storeState = {};
			store.getState.returns(storeState);

			var mapDispatchToConfig = sinon.stub();
			var TestComponent = connect(mapDispatchToConfig)(OriginalComponent);
			component = new TestComponent({
				store,
				foo: 'foo'
			});

			assert.strictEqual(1, mapDispatchToConfig.callCount);
			assert.strictEqual(storeState, mapDispatchToConfig.args[0][0]);
			assert.deepEqual(component.config, mapDispatchToConfig.args[0][1]);
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

		it('should wrap an object of action creators with the store\'s dispatch function', function() {
			function foo(val) {
				return val;
			}
			var TestComponent = connect(null, {foo})(OriginalComponent);
			component = new TestComponent({
				store: buildStoreStub()
			});

			var store = component.getStore();
			var names = Object.keys(component.components);
			var child = component.components[names[0]];
			assert.ok(!child.config.dispatch);
			assert.ok(child.config.foo);
			assert.strictEqual(0, store.dispatch.callCount);

			child.config.foo('bar');
			assert(store.dispatch.calledWithExactly('bar'));
		});
	});

	describe('pure', function() {
		var MainComponent;
		var TestComponent;

		beforeEach(function() {
			class MainTempComponent extends Component {
				createRenderer() {
					var renderer = new IncrementalDomRenderer(this);
					renderer.renderIncDom = function() {
						var args = [TestComponent, null, null, 'ref', 'connect'];
						args.push('foo', this.component_.foo);
						args.push('store', this.component_.store);
						IncrementalDOM.elementVoid.apply(null, args);
					};
					return renderer;
				}
			}
			MainComponent = MainTempComponent;
			MainComponent.STATE = {
				bar: {
					value: 'bar'
				},
				foo: {
					value: 'foo'
				},
				store: {
					value: buildStoreStub()
				}
			};
		});

		it('should not update inner component when pure component\'s config values don\'t change', function(done) {
			TestComponent = connect()(OriginalComponent);

			component = new MainComponent();
			var child = component.components.connect;
			var renderer = child.getRenderer();
			sinon.spy(renderer, 'renderIncDom');

			component.bar = 'bar2';
			component.once('stateSynced', function() {
				assert.strictEqual(0, renderer.renderIncDom.callCount);
				done();
			});
		});

		it('should update inner component when pure component\'s config values change', function(done) {
			TestComponent = connect()(OriginalComponent);

			component = new MainComponent();
			var child = component.components.connect;
			var renderer = child.getRenderer();
			sinon.spy(renderer, 'renderIncDom');

			component.foo = 'foo2';
			component.once('stateSynced', function() {
				assert.strictEqual(1, renderer.renderIncDom.callCount);
				done();
			});
		});

		it('should update inner component when non pure component\'s config values don\'t change', function(done) {
			TestComponent = connect(null, null, null, { pure: false })(OriginalComponent);

			component = new MainComponent();
			var child = component.components.connect;
			var renderer = child.getRenderer();
			sinon.spy(renderer, 'renderIncDom');

			component.bar = 'bar2';
			component.once('stateSynced', function() {
				assert.strictEqual(1, renderer.renderIncDom.callCount);
				done();
			});
		});

		it('should always pass the newest state to mapStoreToConfig', function(done) {
			var mapStub = sinon.stub().returns({bar: 'baz'});
			var storeStub = buildStoreStub();
			storeStub.getState.returns(1)
				.onFirstCall().returns(0);

			TestComponent = connect(mapStub)(OriginalComponent);
			component = new MainComponent(
				{
					store: storeStub
				}
			);
			var emitChange = storeStub.subscribe.firstCall.args[0];
			emitChange();

			component.once('stateSynced', function() {
				assert.strictEqual(mapStub.firstCall.args[0], 0);
				assert.strictEqual(mapStub.secondCall.args[0], 1);
				component.foo = 'bar';

				component.once('stateSynced', function() {
					assert.strictEqual(mapStub.thirdCall.args[0], 1);
					done();
				})
			})
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
