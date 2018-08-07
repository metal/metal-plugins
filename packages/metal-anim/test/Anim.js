'use strict';

import Anim from '../src/Anim';
import dom from 'metal-dom';

describe('Anim', function() {
	// Retry all tests in this suite up to 4 times,
	// It only reports the final result as to whether
	// the test passed at some point (after some number of tries),
	// or failed (because all the tries failed).
	this.retries(4);

	it('should emulate transitionend after transition-duration', function(done) {
		let element = document.createElement('div');
		element.style.transitionDuration = '0.3s';
		element.style.animationDuration = '0.2s';
		dom.enterDocument(element);
		let start = Date.now();
		Anim.emulateTransitionEnd(element);
		dom.once(element, 'transitionend', function() {
			assert.ok(Date.now() - start >= 300);
			dom.exitDocument(element);
			done();
		});
	});

	it('should emulate animationend after animation-duration interval', function(done) {
		let element = document.createElement('div');
		element.style.transitionDuration = '0.3s';
		element.style.animationDuration = '0.2s';
		dom.enterDocument(element);
		let start = Date.now();
		Anim.emulateAnimationEnd(element);
		dom.once(element, 'animationend', function() {
			assert.ok(Date.now() - start >= 200);
			dom.exitDocument(element);
			done();
		});
	});

	it('should emulate the longest duration when `emulateEnd` is used (transitionend)', function(done) {
		let element = document.createElement('div');
		element.style.transitionDuration = '0.3s';
		element.style.animationDuration = '0.2s';
		dom.enterDocument(element);
		let listener = sinon.stub();
		dom.once(element, 'transitionend', listener);
		dom.once(element, 'animationend', listener);
		Anim.emulateEnd(element);
		setTimeout(function() {
			assert.strictEqual(1, listener.callCount);
			assert.strictEqual('transitionend', listener.args[0][0].customType);
			dom.exitDocument(element);
			done();
		}, 350);
	});

	it('should emulate the longest duration when `emulateEnd` is used (animationend)', function(done) {
		let element = document.createElement('div');
		dom.enterDocument(element);
		element.style.transitionDuration = '0.2s';
		element.style.animationDuration = '0.3s';
		let listener = sinon.stub();
		dom.once(element, 'transitionend', listener);
		dom.once(element, 'animationend', listener);
		Anim.emulateEnd(element);
		setTimeout(function() {
			assert.strictEqual(1, listener.callCount);
			assert.strictEqual('animationend', listener.args[0][0].customType);
			dom.exitDocument(element);
			done();
		}, 350);
	});

	// it('should not emulate transitionend if already fired', function(done) {
	// 	Anim.emulateTransitionEnd(element);
	// 	dom.triggerEvent(element, 'transitionend');
	// 	dom.on(element, 'transitionend', function() {
	// 		assert.fail();
	// 	});
	// 	setTimeout(function() {
	// 		done();
	// 	}, 350);
	// });

	it('should not emulate end event for a specified duration', function(done) {
		let element = document.createElement('div');
		element.style.transitionDuration = '0.3s';
		element.style.animationDuration = '0.2s';
		dom.enterDocument(element);
		Anim.emulateEnd(element, 0);
		dom.on(element, 'animationend', function() {
			assert.fail(
				'Transition end event must be fired for the same duration'
			);
		});
		dom.on(element, 'transitionend', function() {
			dom.exitDocument(element);
			done();
		});
	});
});
