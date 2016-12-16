'use strict';

import { async } from 'metal';
import connect from '../src/connect';
import JSXComponent from 'metal-jsx';
import Provider from '../src/Provider';

describe('connect', () => {
	let OriginalComponent;
	let component;

	beforeEach(() => {
		class TestComponent extends JSXComponent {
			render() {
				return <div>{this.props.foo}</div>;
			}
		}
		OriginalComponent = TestComponent;
	});

	afterEach(() => {
		if (component) {
			component.dispose();
		}
	});

	it('should return another component constructor when "connect" is called', () => {
		const TestComponent = connect()(OriginalComponent);
		assert.notStrictEqual(OriginalComponent, TestComponent);
	});

	it('should render the received component', () => {
		const TestComponent = connect()(OriginalComponent);
		component = new TestComponent({
			store: buildStoreStub()
		});

		const names = Object.keys(component.components);
		assert.strictEqual(1, names.length);

		const child = component.components[names[0]];
		assert.ok(child instanceof OriginalComponent);
		assert.strictEqual(component.element, child.element);
	});

	it('should pass any props data to the inner component', () => {
		const TestComponent = connect()(OriginalComponent);
		component = new TestComponent({
			foo: 'foo',
			store: buildStoreStub()
		});

		const names = Object.keys(component.components);
		const child = component.components[names[0]];
		assert.strictEqual('foo', child.props.foo);
	});

	describe('store', () => {
		it('should return the store being used', () => {
			const store = buildStoreStub();
			const TestComponent = connect()(OriginalComponent);
			component = new TestComponent({
				store
			});
			assert.strictEqual(store, component.getStore());
		});

		it('should throw error if no store is passed to wrapped component', () => {
			const TestComponent = connect()(OriginalComponent);
			assert.throws(() => component = new TestComponent());
		});

		it('should use store from Provider parent when there is one', () => {
			const store = buildStoreStub();
			const TestComponent = connect()(OriginalComponent);
			class MainComponent extends JSXComponent {
				render() {
					return <Provider store={store}>
						<TestComponent ref="connect" />
					</Provider>
				}
			}

			component = new MainComponent();
			const child = component.components.connect;
			assert.strictEqual(store, child.getStore());
		});

		it('should not subscribe to given store by default', () => {
			const store = buildStoreStub();
			const TestComponent = connect()(OriginalComponent);
			component = new TestComponent({
				store
			});
			assert.strictEqual(0, store.subscribe.callCount);
		});

		it('should not throw error when detaching and no "mapStoreStateToProps" was given', () => {
			const TestComponent = connect()(OriginalComponent);
			component = new TestComponent({
				store: buildStoreStub()
			});
			assert.doesNotThrow(() => component.detach());
		});

		it('should subscribe to given store if "mapStoreStateToProps" is given', () => {
			const store = buildStoreStub();
			const TestComponent = connect(sinon.stub())(OriginalComponent);
			component = new TestComponent({
				store
			});
			assert.strictEqual(1, store.subscribe.callCount);
		});

		it('should unsubscribe to given store when detached if "mapStoreStateToProps"', () => {
			const unsubscribe = sinon.stub();
			const store = buildStoreStub();
			store.subscribe.returns(unsubscribe);

			const TestComponent = connect(sinon.stub())(OriginalComponent);
			component = new TestComponent({
				store
			});
			assert.strictEqual(0, unsubscribe.callCount);

			component.detach();
			assert.strictEqual(1, unsubscribe.callCount);
		});
	});

	describe('mapStoreStateToProps', () => {
		it('should not pass anything from store state to inner component by default', () => {
			const store = buildStoreStub();
			store.getState.returns({
				foo: 'foo'
			});

			const TestComponent = connect()(OriginalComponent);
			component = new TestComponent({
				store
			});

			const names = Object.keys(component.components);
			const child = component.components[names[0]];
			assert.ok(!child.props.foo);
		});

		it('should pass data specified by "mapStoreStateToProps" to inner component', () => {
			const store = buildStoreStub();
			store.getState.returns({
				foo: 'foo',
				bar: 'bar'
			});

			function mapStoreStateToProps(state) {
				return {
					foo: state.foo
				};
			}

			const TestComponent = connect(mapStoreStateToProps)(OriginalComponent);
			component = new TestComponent({
				store
			});

			const names = Object.keys(component.components);
			const child = component.components[names[0]];
			assert.strictEqual('foo', child.props.foo);
			assert.ok(!child.props.bar);
		});

		it('should update inner component when the store state it uses changes', done => {
			const store = buildStoreStub();
			store.getState.returns({
				foo: 'foo'
			});

			const TestComponent = connect(state => state)(OriginalComponent);
			component = new TestComponent({
				store
			});

			const names = Object.keys(component.components);
			const child = component.components[names[0]];
			assert.strictEqual('foo', child.props.foo);
			assert.strictEqual('foo', child.element.textContent);

			assert.strictEqual(1, store.subscribe.callCount);
			store.getState.returns({
				foo: 'bar'
			});
			store.subscribe.args[0][0]();

			component.once('rendered', () => {
				assert.strictEqual('bar', child.props.foo);
				assert.strictEqual('bar', child.element.textContent);
				done();
			});
		});

		it('should not update inner component when the store state it doesn\'t use changes', done => {
			const store = buildStoreStub();
			store.getState.returns({
				foo: 'foo',
				bar: 'bar'
			});

			const TestComponent = connect(({foo}) => ({
				foo
			}))(OriginalComponent);
			component = new TestComponent({
				store
			});

			const names = Object.keys(component.components);
			const child = component.components[names[0]];
			assert.strictEqual('foo', child.props.foo);
			assert.strictEqual('foo', child.element.textContent);
			assert.strictEqual(1, store.subscribe.callCount);

			const listener = sinon.stub();
			component.on('rendered', listener);

			store.getState.returns({
				foo: 'foo',
				bar: 'bar2'
			});
			store.subscribe.args[0][0]();

			async.nextTick(() => {
				assert.strictEqual(0, listener.callCount);
				done();
			});
		});

		it('should subscribe parent components to store before child components', () => {
			const store = buildStoreStub();
			store.getState.returns({
				foo: 'foo'
			});

			const ChildComponent = connect(state => state)(OriginalComponent);
			class ParentComponent extends JSXComponent {
				render() {
					return <ChildComponent store={this.props.store} />
				}
			}
			const TestComponent = connect(state => state)(ParentComponent);

			component = new TestComponent({
				store
			});
			store.getState.returns({
				foo: 'bar'
			});
			assert.strictEqual(2, store.subscribe.callCount);

			store.subscribe.args[0][0]();
			assert.strictEqual(store.getState(), component.state.storeState);
		});

		it('should receive store state and component props in "mapStoreStateToProps"', () => {
			const store = buildStoreStub();
			const storeState = {};
			store.getState.returns(storeState);

			const mapDispatchToProps = sinon.stub();
			const TestComponent = connect(mapDispatchToProps)(OriginalComponent);
			component = new TestComponent({
				store,
				foo: 'foo'
			});

			assert.strictEqual(1, mapDispatchToProps.callCount);
			assert.strictEqual(storeState, mapDispatchToProps.args[0][0]);
			assert.deepEqual(component.props, mapDispatchToProps.args[0][1]);
		});
	});

	describe('mapDispatchToProps', () => {
		it('should pass dispatch function from store to inner component by default', () => {
			const store = buildStoreStub();
			const TestComponent = connect()(OriginalComponent);
			component = new TestComponent({
				store
			});

			const names = Object.keys(component.components);
			const child = component.components[names[0]];
			assert.strictEqual(store.dispatch, child.props.dispatch);
		});

		it('should pass data specified by "mapDispatchToProps" instead of dispatch function to inner component', () => {
			function mapDispatchToProps(dispatch) {
				return {
					foo: () => dispatch('foo')
				};
			}
			const TestComponent = connect(null, mapDispatchToProps)(OriginalComponent);
			component = new TestComponent({
				store: buildStoreStub()
			});

			const store = component.getStore();
			const names = Object.keys(component.components);
			const child = component.components[names[0]];
			assert.ok(!child.props.dispatch);
			assert.ok(child.props.foo);
			assert.strictEqual(0, store.dispatch.callCount);

			child.props.foo();
			assert.strictEqual(1, store.dispatch.callCount);
			assert.strictEqual('foo', store.dispatch.args[0][0]);
		});

		it('should wrap an object of action creators with the store\'s dispatch function', () => {
			function foo(val) {
				return val;
			}
			const TestComponent = connect(null, {
				foo
			})(OriginalComponent);
			component = new TestComponent({
				store: buildStoreStub()
			});

			const store = component.getStore();
			const names = Object.keys(component.components);
			const child = component.components[names[0]];
			assert.ok(!child.props.dispatch);
			assert.ok(child.props.foo);
			assert.strictEqual(0, store.dispatch.callCount);

			child.props.foo('bar');
			assert(store.dispatch.calledWithExactly('bar'));
		});
	});

	describe('pure', () => {
		let MainComponent;
		let TestComponent;

		beforeEach(() => {
			class MainTempComponent extends JSXComponent {
				render() {
					return <TestComponent
						foo={this.props.foo}
						ref="connect"
						store={this.props.store}
					/>;
				}
			}
			MainComponent = MainTempComponent;
			MainComponent.PROPS = {
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

		it('should not update inner component when pure component\'s prop values don\'t change', done => {
			TestComponent = connect()(OriginalComponent);

			component = new MainComponent();
			const child = component.components.connect;
			sinon.spy(child, 'render');

			component.props.bar = 'bar2';
			component.once('stateSynced', function() {
				assert.strictEqual(0, child.render.callCount);
				done();
			});
		});

		it('should update inner component when pure component\'s prop values change', done => {
			TestComponent = connect()(OriginalComponent);

			component = new MainComponent();
			const child = component.components.connect;
			sinon.spy(child, 'render');

			component.props.foo = 'foo2';
			component.once('stateSynced', function() {
				assert.strictEqual(1, child.render.callCount);
				done();
			});
		});

		it('should update inner component when non pure component\'s prop values don\'t change', done => {
			TestComponent = connect(null, null, null, {
				pure: false
			})(OriginalComponent);

			component = new MainComponent();
			const child = component.components.connect;
			sinon.spy(child, 'render');

			component.props.bar = 'bar2';
			component.once('stateSynced', function() {
				assert.strictEqual(1, child.render.callCount);
				done();
			});
		});

		it('should always pass the newest state to mapStoreStateToProps', done => {
			const mapStub = sinon.stub().returns({
				bar: 'baz'
			});
			const storeStub = buildStoreStub();
			storeStub.getState.returns(1)
				.onFirstCall().returns(0);

			TestComponent = connect(mapStub)(OriginalComponent);
			component = new MainComponent(
				{
					store: storeStub
				}
			);
			const emitChange = storeStub.subscribe.firstCall.args[0];
			emitChange();

			assert.strictEqual(2, mapStub.callCount);
			assert.strictEqual(mapStub.firstCall.args[0], 0);
			assert.strictEqual(mapStub.secondCall.args[0], 1);

			component.props.foo = 'bar';
			component.once('rendered', () => {
				assert.strictEqual(3, mapStub.callCount);
				assert.strictEqual(mapStub.thirdCall.args[0], 1);
				done();
			});
		});

		it('should not call mapStateToProps when it does not depend on ownProps and only props change', done => {
			let callCount = 0;

			const store = buildStoreStub();
			const mapStub = state => {
				callCount++;
				return state;
			};

			TestComponent = connect(mapStub)(OriginalComponent);
			component = new MainComponent({
				store
			});

			assert.strictEqual(1, callCount);
			component.props.foo = 'bar';
			component.once('rendered', () => {
				assert.strictEqual(1, callCount);
				done();
			});
		});

		it('should call mapDispatchToProps when it depends on ownProps and they have changed', done => {
			let callCount = 0;

			const mapDispatchStub = (state, ownProps) => {
				callCount++;
				return state;
			};

			TestComponent = connect(
				sinon.stub().returnsArg(0),
				mapDispatchStub
			)(OriginalComponent);

			component = new MainComponent({
				store: buildStoreStub()
			});

			assert.strictEqual(1, callCount);
			component.props.foo = 'bar';
			component.once('rendered', () => {
				assert.strictEqual(2, callCount);
				done();
			});
		});
	});

	describe('mergeProps', () => {
		it('should be passed the processed props in the correct order', done => {
			const TestComponent = connect(
				() => ({
					mapProp: true
				}),
				() => ({
					dispatchProp: true
				}),
				(ownProps, stateProps, dispatchProps) => {
					assert.propertyVal(ownProps, 'ownProp', true);
					assert.propertyVal(stateProps, 'mapProp', true);
					assert.propertyVal(dispatchProps, 'dispatchProp', true);
					done();
				}
			)(OriginalComponent);

			component = new TestComponent({
				store: buildStoreStub(),
				ownProp: true
			});
		});
	});

	describe('getWrappedInstance', () => {
		it('should return the child componnet', () => {
			const TestComponent = connect(sinon.stub())(OriginalComponent);
			component = new TestComponent({
				store: buildStoreStub()
			});
			assert.instanceOf(component.getWrappedInstance(), OriginalComponent);
		})
	})
});

function buildStoreStub() {
	return {
		dispatch: sinon.stub(),
		getState: sinon.stub().returns({}),
		subscribe: sinon.stub().returns(sinon.stub())
	};
}
