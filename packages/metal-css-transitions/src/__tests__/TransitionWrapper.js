'use strict';
import Component, {Config} from 'metal-jsx';

import TransitionWrapper from '../TransitionWrapper';
import TransitionChild from '../TransitionChild';

describe('TransitionWrapper', function() {
	let component;

	afterEach(() => {
		if (component) {
			component.dispose();
		}
	});

	it('renders', () => {
		component = new TransitionWrapper();

		expect(component);
	});

	it('renders without children', () => {
		class App extends Component {
			render() {
				return <TransitionWrapper elementClasses="wrapper" />;
			}
		}

		component = new App();

		expect(component).toMatchSnapshot();
	});

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

		expect(component).toMatchSnapshot();
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

		expect(component).toMatchSnapshot();
	});

	it('should call setState when new children are supplied', () => {
		const spy = jest.fn();

		component = new TransitionWrapper();

		component.setState = spy;

		expect(spy).not.toBeCalled();
		component.props.children = [{}];

		jest.runAllTimers();

		expect(spy).toBeCalled();
	});

	it('should call syncChildren with empty args', () => {
		const spy = jest.fn();

		component = new TransitionWrapper();

		component.setState = spy;

		expect(spy).not.toBeCalled();

		component.props.children = [];

		jest.runAllTimers();

		expect(spy).toBeCalled();
	});

	it('should process entering children and call .enter()', () => {
		component = new TransitionWrapper();

		const spy = jest.fn();
		const KEY = 1;

		component.refs[KEY] = {
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

		component.handleChildrenEnter_(children, new Map());

		expect(spy).toBeCalled();
	});

	it('should process exiting children and call .leave()', () => {
		component = new TransitionWrapper();

		const spy = jest.fn(callback => callback());
		const KEY = 1;

		component.refs[KEY] = {
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
	});

	it('should remove key from childrenMap_ state', () => {
		component = new TransitionWrapper();
		const KEY = 1;

		component.state.childrenMap_ = new Map().set(KEY, 'test');

		component.finishLeave_(KEY);

		expect(component.state.childrenMap_.has(KEY)).toBeFalsy();
	});

	it('should render children in the order they are given when keys are numbers', () => {
		class App extends Component {
			render() {
				return (
					<TransitionWrapper name="test">
						{this.props.children}
					</TransitionWrapper>
				);
			}
		}

		component = new App();

		component.props.children = [
			<div class="child" key="1">1</div>,
			<div class="child" key="2">2</div>
		];

		jest.runAllTimers();

		expect(component).toMatchSnapshot();

		component.props.children = [
			<div class="child" key={3}>3</div>,
			<div class="child" key={1}>1</div>,
			<div class="child" key={2}>2</div>
		];

		jest.runAllTimers();

		expect(component).toMatchSnapshot();
	});

	it('should render children in the order they are given when keys are strings', () => {
		class App extends Component {
			render() {
				return (
					<TransitionWrapper name="test">
						{this.props.children}
					</TransitionWrapper>
				);
			}
		}

		component = new App();

		component.props.children = [
			<div class="child" key="1">1</div>,
			<div class="child" key="2">2</div>
		];

		jest.runAllTimers();

		expect(component).toMatchSnapshot();

		component.props.children = [
			<div class="child" key="3">3</div>,
			<div class="child" key="1">1</div>,
			<div class="child" key="2">2</div>
		];

		jest.runAllTimers();

		expect(component).toMatchSnapshot();
	});

	it('should not call enter immediately after appear', () => {
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
						<div class="test-child" />
					</TransitionWrapper>
				);
			}
		}

		component = new TestComponent();

		jest.runAllTimers();

		expect(appearSpy).toBeCalled();
		expect(enterSpy).not.toBeCalled();
	});

	it('should call leave when show changes from true to false', () => {
		const originalLeave = TransitionChild.prototype.leave;

		TransitionChild.prototype.leave = jest.fn(callback => callback());

		class App extends Component {
			render() {
				return (
					<TransitionWrapper ref="transitionWrapper" name="test">
						{this.state.show_ &&
							<div class="test-child" ref="testChild">2</div>}
					</TransitionWrapper>
				);
			}
		}

		App.STATE = {
			show_: Config.bool().value(true)
		};

		component = new App();

		jest.runAllTimers();

		component.state.show_ = false;

		jest.runAllTimers();

		expect(TransitionChild.prototype.leave).toHaveBeenCalled();

		TransitionChild.prototype.leave = originalLeave;
	});

	it('should call enter when show changes from false to true', () => {
		const originalEnter = TransitionChild.prototype.enter;

		TransitionChild.prototype.enter = jest.fn();

		class App extends Component {
			render() {
				return (
					<TransitionWrapper ref="transitionWrapper" name="test">
						{this.state.show_ && <div class="test-child">2</div>}
					</TransitionWrapper>
				);
			}
		}

		App.STATE = {
			show_: Config.bool().value(false)
		};

		component = new App();

		jest.runAllTimers();

		component.state.show_ = true;

		jest.runAllTimers();

		expect(TransitionChild.prototype.enter).toHaveBeenCalled();

		TransitionChild.prototype.enter = originalEnter;
	});
});
