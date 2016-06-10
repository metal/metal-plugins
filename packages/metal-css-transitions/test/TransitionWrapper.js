'use strict';
import JSXComponent from 'metal-jsx';

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
			class App extends JSXComponent {
				render() {
					return (
						<TransitionWrapper elementClasses="wrapper"></TransitionWrapper>
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
			class App extends JSXComponent {
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
			class App extends JSXComponent {
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
			component.children = [{}];

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
			component.children = [];

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
					config: {
						key: KEY
					}
				}
			];

			assert.isFalse(stubFn.called);

			component.handleChildrenEnter_(children, {})

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
					config: {
						key: KEY
					}
				}
			];

			assert.isFalse(stubFn.called);

			component.handleChildrenLeave_(children, {})

			assert.isTrue(stubFn.called);

			delete component.components[KEY];
		}
	);

	it(
		'should remove key from childrenMap_ state',
		() => {
			component = new TransitionWrapper();
			const KEY = 1;

			component.childrenMap_ = {[KEY]: 'test'};

			assert(component.childrenMap_[KEY]);

			component.finishLeave_(KEY);

			assert.deepEqual(component.childrenMap_, {});
		}
	);
});
