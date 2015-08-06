'use strict';

import dom from 'bower:metal/src/dom/dom';
import Drag from '../src/Drag';

describe('Drag', function() {
	var drag;

	beforeEach(function() {
		var html = '<div class="item item1"><span class="handle"></span></div>' +
			'<div class="item item2"><span class="handle"></span></div></div>';
		dom.append(document.body, html);
	});

	afterEach(function() {
		document.body.innerHTML = '';
		if (drag) {
			drag.dispose();
		}
	});

	it('should drag source to new position', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			sources: item
		});

		var initialX = item.offsetLeft;
		var initialY = item.offsetTop;
		triggerMouseEvent(item, 'mousedown', 20, 20);
		triggerMouseEvent(document, 'mousemove', 40, 50);

		assert.strictEqual(initialX + 20 + 'px', item.style.left);
		assert.strictEqual(initialY + 30 + 'px', item.style.top);
	});

	it('should ignore mousedown events during dragging', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			sources: item
		});

		var initialX = item.offsetLeft;
		var initialY = item.offsetTop;
		triggerMouseEvent(item, 'mousedown', 20, 20);
		triggerMouseEvent(document, 'mousemove', 40, 50);
		triggerMouseEvent(item, 'mousedown', 50, 60);

		assert.strictEqual(initialX + 20 + 'px', item.style.left);
		assert.strictEqual(initialY + 30 + 'px', item.style.top);
	});

	it('should emit "drag" event with position info', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			sources: item
		});

		var initialX = item.offsetLeft;
		var initialY = item.offsetTop;
		triggerMouseEvent(item, 'mousedown', 20, 20);

		var listener = sinon.stub();
		drag.on(Drag.Events.DRAG, listener);

		triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(1, listener.callCount);
		assert.strictEqual(item, listener.args[0][0].source);
		assert.strictEqual(initialX + 20, listener.args[0][0].x);
		assert.strictEqual(initialY + 30, listener.args[0][0].y);

		triggerMouseEvent(document, 'mousemove', 30, 60);
		assert.strictEqual(2, listener.callCount);
		assert.strictEqual(item, listener.args[1][0].source);
		assert.strictEqual(initialX + 10, listener.args[1][0].x);
		assert.strictEqual(initialY + 40, listener.args[1][0].y);
	});

	it('should emit "end" event when drag ends', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			sources: item
		});

		var initialX = item.offsetLeft;
		var initialY = item.offsetTop;
		triggerMouseEvent(item, 'mousedown', 20, 20);
		triggerMouseEvent(document, 'mousemove', 40, 50);

		var listener = sinon.stub();
		drag.on(Drag.Events.END, listener);
		dom.triggerEvent(document, 'mouseup');

		assert.strictEqual(1, listener.callCount);
		assert.strictEqual(item, listener.args[0][0].source);
		assert.strictEqual(initialX + 20, listener.args[0][0].x);
		assert.strictEqual(initialY + 30, listener.args[0][0].y);
	});

	it('should check if source is being dragged', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			sources: item
		});

		assert.ok(!drag.isDragging());
		triggerMouseEvent(item, 'mousedown', 20, 20);
		assert.ok(!drag.isDragging());
		triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(drag.isDragging());
		dom.triggerEvent(document, 'mouseup');
		assert.ok(!drag.isDragging());
	});

	it('should get the active drag element', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			sources: item
		});

		assert.ok(!drag.getActiveDrag());
		triggerMouseEvent(item, 'mousedown', 20, 20);
		assert.strictEqual(item, drag.getActiveDrag());
		triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(item, drag.getActiveDrag());
		dom.triggerEvent(document, 'mouseup');
		assert.ok(!drag.getActiveDrag());

	});

	it('should not start dragging before reaching the minimum distance', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			sources: item
		});

		var listener = sinon.stub();
		drag.on(Drag.Events.DRAG, listener);

		triggerMouseEvent(item, 'mousedown', 20, 20);
		triggerMouseEvent(document, 'mousemove', 21, 21);
		assert.ok(!drag.isDragging());
		assert.strictEqual(0, listener.callCount);

		triggerMouseEvent(document, 'mousemove', 23, 23);
		assert.ok(drag.isDragging());
		assert.strictEqual(1, listener.callCount);
	});

	it('should allow setting a custom minimum drag distance', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			minimumDragDistance: 2,
			sources: item
		});

		var listener = sinon.stub();
		drag.on(Drag.Events.DRAG, listener);

		triggerMouseEvent(item, 'mousedown', 20, 20);
		triggerMouseEvent(document, 'mousemove', 21, 21);
		assert.ok(drag.isDragging());
		assert.strictEqual(1, listener.callCount);
	});

	it('should allow passing selector for multiple drag elements', function() {
		var item1 = document.querySelector('.item1');
		var item2 = document.querySelector('.item2');
		drag = new Drag({
			minimumDragDistance: 2,
			sources: '.item'
		});

		triggerMouseEvent(item1, 'mousedown', 20, 20);
		triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(item1, drag.getActiveDrag());

		dom.triggerEvent(document, 'mouseup');
		triggerMouseEvent(item2, 'mousedown', 20, 20);
		triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(item2, drag.getActiveDrag());

		dom.triggerEvent(document, 'mouseup');
	});

	it('should not move dragged element if "move" attribute is set to false', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			move: false,
			sources: item
		});

		var initialLeft = item.style.left;
		var initialTop = item.style.top;
		triggerMouseEvent(item, 'mousedown', 20, 20);
		triggerMouseEvent(document, 'mousemove', 40, 50);

		assert.strictEqual(initialLeft, item.style.left);
		assert.strictEqual(initialTop, item.style.top);
	});

	it('should still emit drag event if "move" attribute is set to false', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			move: false,
			sources: item
		});

		var initialX = item.offsetLeft;
		var initialY = item.offsetTop;
		var listener = sinon.stub();
		drag.on(Drag.Events.DRAG, listener);

		triggerMouseEvent(item, 'mousedown', 20, 20);
		triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(1, listener.callCount);
		assert.strictEqual(initialX + 20, listener.args[0][0].x);
		assert.strictEqual(initialY + 30, listener.args[0][0].y);
	});

	it('should disable drag operations', function() {
		var item = document.querySelector('.item');
		drag = new Drag({
			disabled: true,
			sources: item
		});

		triggerMouseEvent(item, 'mousedown', 20, 20);
		triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(!drag.isDragging());
	});

	describe('Handles', function() {
		it('should not drag element if clicked outside handle', function() {
			var item = document.querySelector('.item');
			var handle = item.querySelector('.handle');
			drag = new Drag({
				handles: handle,
				sources: item
			});

			triggerMouseEvent(item, 'mousedown', 20, 20);
			triggerMouseEvent(document, 'mousemove', 40, 50);
			assert.ok(!drag.isDragging());
		});

		it('should drag element if clicked inside handle', function() {
			var item = document.querySelector('.item');
			var handle = item.querySelector('.handle');
			drag = new Drag({
				handles: handle,
				sources: item
			});

			var initialX = item.offsetLeft;
			var initialY = item.offsetTop;

			triggerMouseEvent(handle, 'mousedown', 20, 20);
			triggerMouseEvent(document, 'mousemove', 40, 50);
			assert.ok(drag.isDragging());
			assert.strictEqual(item, drag.getActiveDrag());
			assert.strictEqual(initialX + 20 + 'px', item.style.left);
			assert.strictEqual(initialY + 30 + 'px', item.style.top);
		});

		it('should work with handle selectors', function() {
			var item = document.querySelector('.item');
			var handle = item.querySelector('.handle');
			drag = new Drag({
				handles: '.handle',
				sources: item
			});

			triggerMouseEvent(handle, 'mousedown', 20, 20);
			triggerMouseEvent(document, 'mousemove', 40, 50);
			assert.ok(drag.isDragging());
		});

		it('should work with multiple sources', function() {
			var item1 = document.querySelector('.item1');
			var item2 = document.querySelector('.item2');
			drag = new Drag({
				handles: '.handle',
				sources: '.item'
			});

			triggerMouseEvent(item1.querySelector('.handle'), 'mousedown', 20, 20);
			triggerMouseEvent(document, 'mousemove', 40, 50);
			assert.strictEqual(item1, drag.getActiveDrag());

			dom.on(document, 'mouseup');
			triggerMouseEvent(item2.querySelector('.handle'), 'mousedown', 20, 20);
			triggerMouseEvent(document, 'mousemove', 40, 50);
			assert.strictEqual(item2, drag.getActiveDrag());
		});
	});

	describe('Drag Placeholder', function() {
		it('should not move source node if "dragPlaceholder" is set to "clone"', function() {
			var item = document.querySelector('.item');
			drag = new Drag({
				dragPlaceholder: Drag.Placeholder.CLONE,
				sources: item
			});

			var initialLeft = item.style.left;
			var initialTop = item.style.top;
			triggerMouseEvent(item, 'mousedown', 20, 20);
			triggerMouseEvent(document, 'mousemove', 40, 50);

			assert.strictEqual(initialLeft, item.style.left);
			assert.strictEqual(initialTop, item.style.top);
		});

		it('should move a clone of the source if "dragPlaceholder" is set to "clone"', function() {
			var item = document.querySelector('.item');
			drag = new Drag({
				dragPlaceholder: Drag.Placeholder.CLONE,
				sources: item
			});

			var listener = sinon.stub();
			drag.on(Drag.Events.DRAG, listener);

			var initialX = item.offsetLeft;
			var initialY = item.offsetTop;
			triggerMouseEvent(item, 'mousedown', 20, 20);
			triggerMouseEvent(document, 'mousemove', 40, 50);

			var event = listener.args[0][0];
			assert.strictEqual(item, event.source);
			assert.notStrictEqual(item, event.placeholder);
			assert.strictEqual(initialX + 20 + 'px', event.placeholder.style.left);
			assert.strictEqual(initialY + 30 + 'px', event.placeholder.style.top);
		});

		it('should not move source node if "dragPlaceholder" is set to another element', function() {
			var placeholder = document.createElement('div');
			var item = document.querySelector('.item');
			drag = new Drag({
				dragPlaceholder: placeholder,
				sources: item
			});

			var initialLeft = item.style.left;
			var initialTop = item.style.top;
			triggerMouseEvent(item, 'mousedown', 20, 20);
			triggerMouseEvent(document, 'mousemove', 40, 50);

			assert.strictEqual(initialLeft, item.style.left);
			assert.strictEqual(initialTop, item.style.top);
		});

		it('should move the element set as the "dragPlaceholder"', function() {
			var placeholder = document.createElement('div');
			var item = document.querySelector('.item');
			drag = new Drag({
				dragPlaceholder: placeholder,
				sources: item
			});

			var listener = sinon.stub();
			drag.on(Drag.Events.DRAG, listener);

			var initialX = item.offsetLeft;
			var initialY = item.offsetTop;
			triggerMouseEvent(item, 'mousedown', 20, 20);
			triggerMouseEvent(document, 'mousemove', 40, 50);

			var event = listener.args[0][0];
			assert.strictEqual(item, event.source);
			assert.strictEqual(placeholder, event.placeholder);
			assert.strictEqual(initialX + 20 + 'px', placeholder.style.left);
			assert.strictEqual(initialY + 30 + 'px', placeholder.style.top);
		});

		it('should move the source element at the end even if "dragPlaceholder" is set', function() {
			var item = document.querySelector('.item');
			drag = new Drag({
				dragPlaceholder: Drag.Placeholder.CLONE,
				sources: item
			});

			var initialX = item.offsetLeft;
			var initialY = item.offsetTop;
			triggerMouseEvent(item, 'mousedown', 20, 20);
			triggerMouseEvent(document, 'mousemove', 40, 50);
			dom.triggerEvent(document, 'mouseup');
			assert.strictEqual(initialX + 20 + 'px', item.style.left);
			assert.strictEqual(initialY + 30 + 'px', item.style.top);
		});

		it('should not move the source element at the end if "moveOnEnd" is set to false', function() {
			var item = document.querySelector('.item');
			drag = new Drag({
				dragPlaceholder: Drag.Placeholder.CLONE,
				moveOnEnd: false,
				sources: item
			});

			var initialLeft = item.style.left;
			var initialTop = item.style.top;
			triggerMouseEvent(item, 'mousedown', 20, 20);
			triggerMouseEvent(document, 'mousemove', 40, 50);
			dom.triggerEvent(document, 'mouseup');

			assert.strictEqual(initialLeft, item.style.left);
			assert.strictEqual(initialTop, item.style.top);
		});
	});

	function triggerMouseEvent(target, eventType, x, y) {
		dom.triggerEvent(target, eventType, {
			clientX: x,
			clientY: y
		});
	}
});
