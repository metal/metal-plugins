'use strict';

import Anim from '../src/Anim';
import dom from 'bower:metal/src/dom/dom';

describe('Anim', function() {
	beforeEach(function() {
		this.element = document.createElement('div');
		this.element.style.transitionDuration = '0.3s';
		this.element.style.animationDuration = '0.2s';
		dom.enterDocument(this.element);
	});

	afterEach(function() {
		dom.exitDocument(this.element);
	});

	it('should emulate transitionend after transition-duration', function(done) {
		var start = Date.now();
		Anim.emulateTransitionEnd(this.element);
		dom.once(this.element, 'transitionend', function() {
			assert.ok(Date.now() - start >= 300);
			done();
		});
	});

	it('should emulate animationend after animation-duration interval', function(done) {
		var start = Date.now();
		Anim.emulateAnimationEnd(this.element);
		dom.once(this.element, 'animationend', function() {
			assert.ok(Date.now() - start >= 200);
			done();
		});
	});

	it('should emulate the longest duration when `emulateEnd` is used (transitionend)', function(done) {
		var listener = sinon.stub();
		dom.once(this.element, 'transitionend', listener);
		dom.once(this.element, 'animationend', listener);
		Anim.emulateEnd(this.element);
		setTimeout(function() {
			assert.strictEqual(1, listener.callCount);
			assert.strictEqual('transitionend', listener.args[0][0].customType);
			done();
		}, 350);
	});

	it('should emulate the longest duration when `emulateEnd` is used (animationend)', function(done) {
		this.element.style.transitionDuration = '0.2s';
		this.element.style.animationDuration = '0.3s';
		var listener = sinon.stub();
		dom.once(this.element, 'transitionend', listener);
		dom.once(this.element, 'animationend', listener);
		Anim.emulateEnd(this.element);
		setTimeout(function() {
			assert.strictEqual(1, listener.callCount);
			assert.strictEqual('animationend', listener.args[0][0].customType);
			done();
		}, 350);
	});

	it('should not emulate transitionend if already fired', function(done) {
		Anim.emulateTransitionEnd(this.element);
		dom.triggerEvent(this.element, 'transitionend');
		dom.on(this.element, 'transitionend', function() {
			assert.fail();
		});
		setTimeout(function() {
			done();
		}, 350);
	});

	it('should not emulate end event for a specified duration', function(done) {
		Anim.emulateEnd(this.element, 0);
		dom.on(this.element, 'animationend', function() {
			assert.fail('Transition end event must be fired for the same duration');
		});
		dom.on(this.element, 'transitionend', function(event) {
			done();
		});
	});
});
