'use strict';

import dom from 'metal-dom';
import DragShim from '../../src/helpers/DragShim';

describe('DragShim', function() {
	afterEach(function() {
		DragShim.reset();
	});

	it('should return shim element from "getDocShim" method', function() {
		assert.ok(DragShim.getDocShim());
	});

	it('should always return the same shim element from "getDocShim"', function() {
		assert.strictEqual(DragShim.getDocShim(), DragShim.getDocShim());
	});

	it('should create new shim element if "reset" is called', function() {
		let shim = DragShim.getDocShim();
		DragShim.reset();
		assert.notStrictEqual(shim, DragShim.getDocShim());
	});

	it('should attach mouse listeners to the shim element', function() {
		let listener = sinon.stub();
		DragShim.attachDocListeners(true, {
			mousedown: listener,
		});

		dom.triggerEvent(document, 'mousedown');
		assert.strictEqual(0, listener.callCount);

		dom.triggerEvent(DragShim.getDocShim(), 'mousedown');
		assert.strictEqual(1, listener.callCount);
	});

	it('should attach non mouse listeners to the document', function() {
		let listener = sinon.stub();
		DragShim.attachDocListeners(true, {
			touchstart: listener,
		});

		dom.triggerEvent(document, 'touchstart');
		assert.strictEqual(1, listener.callCount);
	});

	it('should attach mouse listeners to the document if "useShim" is passed as false', function() {
		let listener = sinon.stub();
		DragShim.attachDocListeners(false, {
			mousedown: listener,
		});

		dom.triggerEvent(document, 'mousedown');
		assert.strictEqual(1, listener.callCount);
	});

	it('should show document shim when attaching listeners to it', function() {
		let shim = DragShim.getDocShim();
		assert.strictEqual('none', shim.style.display);

		DragShim.attachDocListeners(true, {
			mousedown: sinon.stub(),
		});
		assert.strictEqual('block', shim.style.display);
	});

	it('should hide document shim', function() {
		let shim = DragShim.getDocShim();
		DragShim.hideDocShim();
		assert.strictEqual('none', shim.style.display);
	});
});
