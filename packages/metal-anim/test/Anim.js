'use strict';

import Anim from '../src/Anim';
import async from 'bower:metal/src/async/async';
import dom from 'bower:metal/src/dom/dom';
import features from 'bower:metal/src/dom/features';

describe('Anim', function() {
	beforeEach(function() {
		this.element = document.createElement('div');
		this.element.style.transitionDuration = '0.3s';
		this.element.style.animationDuration = '0.3s';
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

	it('should emulate animationend after animation-duration', function(done) {
		var start = Date.now();
		Anim.emulateAnimationEnd(this.element);
		dom.once(this.element, 'animationend', function() {
			assert.ok(Date.now() - start >= 300);
			done();
		});
	});

	it('should emulate only the first emitted end event when `emulateEnd` is used', function(done) {
		var listener = sinon.stub();
		dom.once(this.element, 'transitionend', listener);
		dom.once(this.element, 'animationend', listener);
		Anim.emulateEnd(this.element, 0);
		setTimeout(function() {
			assert.strictEqual(1, listener.callCount);
			done();
		}, 25);
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
});
