'use strict';

import dom from 'bower:metal/src/dom/dom';
import DragShim from '../../src/helpers/DragShim';

describe('DragShim', function() {
	afterEach(function() {
		DragShim.shim_ = null;
	});

	it('should return shim element from "getShim" method', function() {
		assert.ok(DragShim.getShim());
	});

	it('should always return the same shim element from "getShim"', function() {
		assert.strictEqual(DragShim.getShim(), DragShim.getShim());
	});

	it('should attach mouse listeners to the shim element', function() {
		var listener = sinon.stub();
		DragShim.attachDocListeners(true, {
			mousedown: listener
		});

		dom.triggerEvent(document, 'mousedown');
		assert.strictEqual(0, listener.callCount);

		dom.triggerEvent(DragShim.getShim(), 'mousedown');
		assert.strictEqual(1, listener.callCount);
	});

	it('should attach non mouse listeners to the document', function() {
		var listener = sinon.stub();
		DragShim.attachDocListeners(true, {
			touchstart: listener
		});

		dom.triggerEvent(document, 'touchstart');
		assert.strictEqual(1, listener.callCount);
	});

	it('should attach mouse listeners to the document if "useShim" is passed as false', function() {
		var listener = sinon.stub();
		DragShim.attachDocListeners(false, {
			mousedown: listener
		});

		dom.triggerEvent(document, 'mousedown');
		assert.strictEqual(1, listener.callCount);
	});
});
