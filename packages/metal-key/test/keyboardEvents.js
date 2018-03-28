'use strict';

import dom from 'metal-dom';
import { KEYMAP } from '../src/keyboardEvents';
import Component from 'metal-component';
import IncrementalDomRenderer from 'metal-incremental-dom';

var IncDom = IncrementalDOM;

describe('KeyboardEvents', function() {
	describe('From JavaScript binding', function() {
		it('should listen to the keydown keyboard event by keyCode alias', function() {
			var listener = sinon.stub();
			var element = document.createElement('input');
			dom.enterDocument(element);
			dom.on(element, 'keydown-enter', listener);
			dom.triggerEvent(element, 'keydown', {keyCode: KEYMAP.ENTER});
			assert.strictEqual(1, listener.callCount);
		});

		it('should delegate parameterized keyboard event', function() {
			var listener = sinon.stub();
			var container = document.createElement('div');
			var inputElement = document.createElement('input');
			dom.enterDocument(inputElement);
			dom.append(container, inputElement);
			dom.delegate(container, 'keydown-enter', inputElement, listener);
			dom.triggerEvent(inputElement, 'keydown', {keyCode: KEYMAP.ENTER});
			assert.strictEqual(1, listener.callCount);
		});

		it('should listen to the keypress keyboard event by keyCode alias', function() {
			var listener = sinon.stub();
			var element = document.createElement('input');
			dom.enterDocument(element);
			dom.on(element, 'keypress-enter', listener);
			dom.triggerEvent(element, 'keypress', {keyCode: KEYMAP.ENTER});
			assert.strictEqual(1, listener.callCount);
		});

		it('should listen to the keyup keyboard event by keyCode alias', function() {
			var listener = sinon.stub();
			var element = document.createElement('input');
			dom.enterDocument(element);
			dom.on(element, 'keyup-enter', listener);
			dom.triggerEvent(element, 'keyup', {keyCode: KEYMAP.ENTER});
			assert.strictEqual(1, listener.callCount);
		});

		it('should not trigger the listener to an unmatched key alias', function() {
			var listener = sinon.stub();
			var element = document.createElement('input');
			dom.enterDocument(element);
			dom.on(element, 'keyup-enter', listener);
			dom.triggerEvent(element, 'keyup', {keyCode: KEYMAP.SPACE});
			assert.strictEqual(0, listener.callCount);
		});

		it('should not stop listening to an unparameterized keyboard event', function() {
			var listener = sinon.stub();
			var element = document.createElement('input');
			dom.enterDocument(element);
			dom.on(element, 'keyup', listener);
			dom.triggerEvent(element, 'keyup', {keyCode: KEYMAP.ENTER});
			assert.strictEqual(1, listener.callCount);
		});

		it('should pass through the event object the custom event name used', function(done) {
			var element = document.createElement('input');
			dom.enterDocument(element);
			dom.on(element, 'keyup-enter', function(event) {
				assert.strictEqual(event.customType, 'keyup-enter');
				done();
			});
			dom.triggerEvent(element, 'keyup', {keyCode: KEYMAP.ENTER});
		});
	});

	describe('From IncrementalDOM', function() {
		it('should listen to the keyboard event only if the key pressed matches with the event name using (onKeydown-enter) pattern', function() {
			var callback = sinon.stub();
			class TestComponent extends Component {
				render() {
					IncDom.elementOpen('div');
					IncDom.elementVoid('input', null, null, 'onKeydown-enter', 'handleClick');
					IncDom.elementClose('div');
				}
			}
			TestComponent.RENDERER = IncrementalDomRenderer;
			TestComponent.prototype.handleClick = callback;

			var component = new TestComponent();
			dom.triggerEvent(component.element.querySelector('input'), 'keydown', {keyCode: KEYMAP.ENTER});
			assert.strictEqual(KEYMAP.ENTER, callback.args[0][0].keyCode, 'The keyCode should match with the event name');
		});

		it('should listen to the keyboard event only if the key pressed matches with the event name using (data-on-eventname) pattern', function() {
			var callback = sinon.stub();
			class TestComponent extends Component {
				render() {
					IncDom.elementOpen('div');
					IncDom.elementVoid('input', null, null, 'data-onkeydown-enter', 'handleClick');
					IncDom.elementClose('div');
				}
			}
			TestComponent.RENDERER = IncrementalDomRenderer;
			TestComponent.prototype.handleClick = callback;

			var component = new TestComponent();
			dom.triggerEvent(component.element.querySelector('input'), 'keydown', {keyCode: KEYMAP.ENTER});
			assert.strictEqual(KEYMAP.ENTER, callback.args[0][0].keyCode, 'The keyCode should match with the event name');
		});
	});
});
