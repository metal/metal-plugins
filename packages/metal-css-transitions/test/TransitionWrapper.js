'use strict';
import Component from 'metal-jsx';

import TransitionWrapper from '../src/TransitionWrapper';

describe('TransitionWrapper', function() {
	let component;

	afterEach(
		() => {
			if (component) {
				component.dispose();
			}
		}
	);

	it(
		'renders',
		() => {
			component = new TransitionWrapper();

			assert(component);
		}
	);

	it(
		'renders without children',
		() => {
			class App extends Component {
				render() {
					return (
						<TransitionWrapper elementClasses="wrapper">
						</TransitionWrapper>
						);
				}
			}

			component = new App();

			assert.strictEqual('wrapper', component.element.className);
		}
	);

	it(
		'renders with one child',
		() => {
			class App extends Component {
				render() {
					return (
						<TransitionWrapper name="test">
							<div class="child">Child</div>
						</TransitionWrapper>
						);
				}
			}

			component = new App();

			assert(component.element.querySelector('.child'));
		}
	);

	it(
		'renders with multiple children',
		() => {
			class App extends Component {
				render() {
					return (
						<TransitionWrapper name="test">
							<div class="child1" key={1}>Child</div>
							<div class="child2" key={2}>Child</div>
						</TransitionWrapper>
						);
				}
			}

			component = new App();

			assert(component.element.querySelector('.child1'));
			assert(component.element.querySelector('.child2'));
		}
	);

	it(
		'should call setState when new children are supplied',
		(done) => {
			component = new TransitionWrapper();

			const setStateSpy = sinon.spy(component, 'setState');

			assert.isFalse(setStateSpy.called);
			component.props.children = [{}];

			setTimeout(
				() => {
					assert.isTrue(setStateSpy.called);
					done()
				},
				100
			);
		}
	);

	it(
		'should call syncChildren with empty args',
		(done) => {
			component = new TransitionWrapper();

			const setStateSpy = sinon.spy(component, 'setState');

			assert.isFalse(setStateSpy.called);
			component.props.children = [];

			setTimeout(
				() => {
					assert.isTrue(setStateSpy.called);
					done()
				},
				100
			);
		}
	);

	it(
		'should process entering children and call .enter()',
		() => {
			component = new TransitionWrapper();

			const stubFn = sinon.stub();
			const KEY = 1;

			component.components[KEY] = {
				enter: stubFn
			};

			const children = [
				{
					props: {
						key: KEY
					}
				}
			];

			assert.isFalse(stubFn.called);

			component.handleChildrenEnter_(children, new Map())

			assert.isTrue(stubFn.called);

			delete component.components[KEY];
		}
	);

	it(
		'should process exiting children and call .leave()',
		() => {
			component = new TransitionWrapper();

			const stubFn = sinon.stub();
			const KEY = 1;

			component.components[KEY] = {
				leave: stubFn
			};

			const children = [
				{
					props: {
						key: KEY
					}
				}
			];

			assert.isFalse(stubFn.called);

			component.handleChildrenLeave_(children, new Map())

			assert.isTrue(stubFn.called);

			delete component.components[KEY];
		}
	);

	it(
		'should remove key from childrenMap_ state',
		() => {
			component = new TransitionWrapper();
			const KEY = 1;

			component.state.childrenMap_ = new Map().set(KEY, 'test');

			component.finishLeave_(KEY);

			assert.isFalse(component.state.childrenMap_.has(KEY));
		}
	);

	it(
		'should render children in the order they are given when keys are numbers',
		(done) => {
			class App extends Component {
				render() {
					return (
						<TransitionWrapper name="test">
							{this.props.children}
						</TransitionWrapper>
						);
				}
			}

			component = new App(
				{
					children: [
						<div class="child" key={1}>1</div>,
						<div class="child" key={2}>2</div>
					]
				}
			);

			let children = component.element.querySelectorAll('.child');

			assert.strictEqual(children[0].innerHTML, '1');
			assert.strictEqual(children[1].innerHTML, '2');

			component.props.children = [
				<div class="child" key={3}>3</div>,
				<div class="child" key={1}>1</div>,
				<div class="child" key={2}>2</div>
			];

			setTimeout(
				() => {
					children = component.element.querySelectorAll('.child');

					assert.strictEqual(children[0].innerHTML, '3');
					assert.strictEqual(children[1].innerHTML, '1');
					assert.strictEqual(children[2].innerHTML, '2');

					done();
				},
				100
			);
		}
	);

	it(
		'should render children in the order they are given when keys are strings',
		(done) => {
			class App extends Component {
				render() {
					return (
						<TransitionWrapper name="test">
							{this.props.children}
						</TransitionWrapper>
						);
				}
			}

			component = new App(
				{
					children: [
						<div class="child" key="1">1</div>,
						<div class="child" key="2">2</div>
					]
				}
			);

			let children = component.element.querySelectorAll('.child');

			assert.strictEqual(children[0].innerHTML, '1');
			assert.strictEqual(children[1].innerHTML, '2');

			component.props.children = [
				<div class="child" key="3">3</div>,
				<div class="child" key="1">1</div>,
				<div class="child" key="2">2</div>
			];

			setTimeout(
				() => {
					children = component.element.querySelectorAll('.child');

					assert.strictEqual(children[0].innerHTML, '3');
					assert.strictEqual(children[1].innerHTML, '1');
					assert.strictEqual(children[2].innerHTML, '2');

					done();
				},
				100
			);
		}
	);
});
