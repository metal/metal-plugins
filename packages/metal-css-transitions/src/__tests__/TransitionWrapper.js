'use strict';
import Component from 'metal-jsx';

import TransitionWrapper from '../TransitionWrapper';
import TransitionChild from '../TransitionChild';

describe('TransitionWrapper', function() {
	let component;

	afterEach(
		() => {
			if (component) {
				component.dispose();
			}
		}
	);

	it('renders', () => {
		component = new TransitionWrapper();

		expect(component);
	});

	it('renders without children', () => {
		class App extends Component {
			render() {
				return (
					<TransitionWrapper elementClasses="wrapper">
					</TransitionWrapper>
				);
			}
		}

		component = new App();

		expect(component.element.className).toBe('wrapper');
	}
	);

	it('renders with one child', () => {
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

		expect(component.element.querySelector('.child'));
	});

	it('renders with multiple children', () => {
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

		expect(component.element.querySelector('.child1'));
		expect(component.element.querySelector('.child2'));
	});

	it('should call setState when new children are supplied', done => {
		const spy = jest.fn();

		component = new TransitionWrapper();

		component.setState = spy;

		expect(spy).not.toBeCalled();
		component.props.children = [{}];

		setTimeout(
			() => {
				expect(spy).toBeCalled();

				done()
			},
			100
		);
	});

	it('should call syncChildren with empty args', done => {
		const spy = jest.fn();

		component = new TransitionWrapper();

		component.setState = spy;

		expect(spy).not.toBeCalled();

		component.props.children = [];

		setTimeout(
			() => {
				expect(spy).toBeCalled();

				done()
			},
			100
		);
	});

	it('should process entering children and call .enter()', () => {
		component = new TransitionWrapper();

		const spy = jest.fn();
		const KEY = 1;

		component.components[KEY] = {
			enter: spy
		};

		const children = [
			{
				props: {
					key: KEY
				}
			}
		];

		expect(spy).not.toBeCalled();

		component.handleChildrenEnter_(children, new Map())

		expect(spy).toBeCalled();

		delete component.components[KEY];
	});

	it('should process exiting children and call .leave()', () => {
		component = new TransitionWrapper();

		const spy = jest.fn();
		const KEY = 1;

		component.components[KEY] = {
			leave: spy
		};

		const children = [
			{
				props: {
					key: KEY
				}
			}
		];

		expect(spy).not.toBeCalled();

		component.handleChildrenLeave_(children, new Map());

		expect(spy).toBeCalled();

		delete component.components[KEY];
	});

	it('should remove key from childrenMap_ state', () => {
		component = new TransitionWrapper();
		const KEY = 1;

		component.state.childrenMap_ = new Map().set(KEY, 'test');

		component.finishLeave_(KEY);

		expect(component.state.childrenMap_.has(KEY)).toBeFalsy();
	});

	it('should render children in the order they are given when keys are numbers', done => {
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

		expect(children[0].innerHTML).toBe('1');
		expect(children[1].innerHTML).toBe('2');

		component.props.children = [
			<div class="child" key={3}>3</div>,
			<div class="child" key={1}>1</div>,
			<div class="child" key={2}>2</div>
		];

		setTimeout(
			() => {
				children = component.element.querySelectorAll('.child');

				expect(children[0].innerHTML).toBe('3');
				expect(children[1].innerHTML).toBe('1');
				expect(children[2].innerHTML).toBe('2');

				done();
			},
			100
		);
	});

	it('should render children in the order they are given when keys are strings', done => {
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

		expect(children[0].innerHTML).toBe('1');
		expect(children[1].innerHTML).toBe('2');

		component.props.children = [
			<div class="child" key="3">3</div>,
			<div class="child" key="1">1</div>,
			<div class="child" key="2">2</div>
		];

		setTimeout(
			() => {
				children = component.element.querySelectorAll('.child');

				expect(children[0].innerHTML).toBe('3');
				expect(children[1].innerHTML).toBe('1');
				expect(children[2].innerHTML).toBe('2');

				done();
			},
			100
		);
	});

	it('should not call enter immediately after appear', () => {
		jest.useFakeTimers();

		const originalEnter = TransitionChild.prototype.enter;
		const enterSpy = jest.fn(function() {
			return originalEnter.apply(this, arguments);
		});

		const originalAppear = TransitionChild.prototype.appear;
		const appearSpy = jest.fn(function() {
			return originalAppear.apply(this, arguments);
		});

		TransitionChild.prototype.enter = enterSpy;
		TransitionChild.prototype.appear = appearSpy;

		class TestComponent extends Component {
			render() {
				return (
					<TransitionWrapper>
						<div class="test-child"></div>
					</TransitionWrapper>
				);
			}
		}

		component = new TestComponent();

		jest.runAllTimers();

		expect(appearSpy).toBeCalled();
		expect(enterSpy).not.toBeCalled();

		jest.useRealTimers();
	});
});
