'use strict';
import JSXComponent from 'metal-jsx';

import TransitionChild, { DELAY_TIME } from '../src/TransitionChild';

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

			assert(component);
		}
	);

	it('should delay before adding a class', function(done) {
		const component = new TransitionChild();
		const node = document.createElement('div');

		assert.strictEqual('', node.className);
		component.delayActive_('test', node);
		assert.strictEqual('', node.className);

		setTimeout(
			() => {
				assert.strictEqual('test', node.className);

				done();
			},
			DELAY_TIME
		);
	});

	it('should add and remove classnames', function(done) {
		const DELAY = 100;
		const TRANS_NAME = 'test';
		const TRANS_TYPE = 'appear';

		class App extends JSXComponent {
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

		assert.strictEqual(`${TRANS_NAME}-${TRANS_TYPE}`, appElem.className);

		setTimeout(
			() => {
				assert.strictEqual(`${TRANS_NAME}-${TRANS_TYPE} ${TRANS_NAME}-${TRANS_TYPE}-active`, appElem.className);

				setTimeout(
					() => {
						assert.strictEqual('', appElem.className);

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
		const stubFn = sinon.stub();

		class App extends JSXComponent {
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

		assert.isFalse(stubFn.called);

		setTimeout(
			() => {
				assert.isTrue(stubFn.called);

				done();
			},
			DELAY
		);
	});

	it('should call transition_ with appear', function() {
		const component = new TransitionChild();

		const transitionFn = sinon.stub(component, 'transition_');

		assert.isFalse(transitionFn.called);
		component.appear();
		assert.isTrue(transitionFn.calledWith('appear'));
	});

	it('should call transition_ with enter', function() {
		const component = new TransitionChild();

		const transitionFn = sinon.stub(component, 'transition_');

		assert.isFalse(transitionFn.called);
		component.enter();
		assert.isTrue(transitionFn.calledWith('enter'));
	});

	it('should call transition_ with leave', function() {
		const component = new TransitionChild();

		const transitionFn = sinon.stub(component, 'transition_');

		assert.isFalse(transitionFn.called);
		component.leave();
		assert.isTrue(transitionFn.calledWith('leave'));
	});
});
