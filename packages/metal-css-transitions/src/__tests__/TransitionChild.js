'use strict';
import Component from 'metal-jsx';

import TransitionChild, { DELAY_TIME } from '../TransitionChild';

describe('TransitionChild', function() {
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
			const component = new TransitionChild();

			expect(component);
		}
	);

	it('should delay before adding a class', function(done) {
		const component = new TransitionChild();
		const node = document.createElement('div');

		expect(node.className).toBe('');
		component.delayActive_('test', node);
		expect(node.className).toBe('');

		setTimeout(
			() => {
				expect(node.className).toBe('test');

				done();
			},
			DELAY_TIME
		);
	});

	it('should add and remove classnames', function(done) {
		const DELAY = 100;
		const TRANS_NAME = 'test';
		const TRANS_TYPE = 'appear';

		class App extends Component {
			render() {
				return (
					<TransitionChild name={TRANS_NAME} ref="transitionChild">
						<div></div>
					</TransitionChild>
					);
			}
		}

		const app = new App();
		const appElem = app.element;

		const transitionChild = app.components.transitionChild;

		transitionChild.transition_(TRANS_TYPE, null, DELAY);

		expect(appElem.className).toBe(`${TRANS_NAME}-${TRANS_TYPE}`);

		setTimeout(
			() => {
				expect(appElem.className).toBe(`${TRANS_NAME}-${TRANS_TYPE} ${TRANS_NAME}-${TRANS_TYPE}-active`);

				setTimeout(
					() => {
						expect(appElem.className).toBe('');

						done();
					},
					DELAY
				);
			},
			DELAY_TIME
		);
	});

	it('should execute callbackFn', function(done) {
		const DELAY = 100;
		const stubFn = jest.fn();

		class App extends Component {
			render() {
				return (
					<TransitionChild name="test" ref="transitionChild">
						<div></div>
					</TransitionChild>
					);
			}
		}

		const app = new App();
		const transitionChild = app.components.transitionChild;

		transitionChild.transition_(null, stubFn, DELAY);

		expect(stubFn).not.toBeCalled();

		setTimeout(
			() => {
				expect(stubFn).toBeCalled();

				done();
			},
			DELAY
		);
	});

	it('should call transition_ with appear', function() {
		const spy = jest.fn();
		const component = new TransitionChild();

		component.transition_ = spy;

		expect(spy).not.toBeCalled();
		component.appear();
		expect(spy).toBeCalledWith('appear');
	});

	it('should call transition_ with enter', function() {
		const spy = jest.fn();
		const component = new TransitionChild();

		component.transition_ = spy;

		expect(spy).not.toBeCalled();
		component.enter();
		expect(spy).toBeCalledWith('enter');
	});

	it('should call transition_ with leave', function() {
		const spy = jest.fn();
		const callback = jest.fn();

		const component = new TransitionChild();

		component.transition_ = spy;

		expect(spy).not.toBeCalled();
		component.leave(callback);
		expect(spy).toBeCalledWith('leave', callback);
	});
});
