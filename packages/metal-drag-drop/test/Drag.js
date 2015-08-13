'use strict';

import dom from 'bower:metal/src/dom/dom';
import Drag from '../src/Drag';
import DragShim from '../src/helpers/DragShim';
import DragTestHelper from './fixtures/DragTestHelper';

describe('Drag', function() {
	var drag;

	beforeEach(function() {
		var html = '<div class="item item1"><span class="handle"></span></div>' +
			'<div class="item item2"><span class="handle"></span></div></div>';
		dom.append(document.body, html);
	});

	afterEach(function() {
		document.body.innerHTML = '';
		DragShim.docShim_ = null;
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
		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

		assert.strictEqual(initialX + 20 + 'px', item.style.left);
		assert.strictEqual(initialY + 30 + 'px', item.style.top);
	});

	it('should drag source to new position without shim', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			sources: item,
			useShim: false
		});

		var initialX = item.offsetLeft;
		var initialY = item.offsetTop;
		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

		assert.strictEqual(initialX + 20 + 'px', item.style.left);
		assert.strictEqual(initialY + 30 + 'px', item.style.top);
	});

	it('should only drag source with left mouse button', function() {
		if ('ontouchstart' in window) {
			// Skip this for touch devices, since they won't use mouse events.
			return;
		}

		var item = document.querySelector('.item1');
		drag = new Drag({
			sources: item
		});

		var initialLeft = item.style.left;
		var initialTop = item.style.top;
		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20, 1);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

		assert.strictEqual(initialLeft, item.style.left);
		assert.strictEqual(initialTop, item.style.top);
	});

	it('should ignore mousedown events during dragging', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			sources: item
		});

		var initialX = item.offsetLeft;
		var initialY = item.offsetTop;
		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		DragTestHelper.triggerMouseEvent(item, 'mousedown', 50, 60);

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
		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);

		var listener = sinon.stub();
		drag.on(Drag.Events.DRAG, listener);

		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(1, listener.callCount);
		assert.strictEqual(item, listener.args[0][0].source);
		assert.strictEqual(initialX + 20, listener.args[0][0].x);
		assert.strictEqual(initialY + 30, listener.args[0][0].y);

		DragTestHelper.triggerMouseEvent(document, 'mousemove', 30, 60);
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
		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

		var listener = sinon.stub();
		drag.on(Drag.Events.END, listener);
		DragTestHelper.triggerMouseEvent(document, 'mouseup');

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
		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		assert.ok(!drag.isDragging());
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(drag.isDragging());
		DragTestHelper.triggerMouseEvent(document, 'mouseup');
		assert.ok(!drag.isDragging());
	});

	it('should get the active drag element', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			sources: item
		});

		assert.ok(!drag.getActiveDrag());
		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		assert.strictEqual(item, drag.getActiveDrag());
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(item, drag.getActiveDrag());
		DragTestHelper.triggerMouseEvent(document, 'mouseup');
		assert.ok(!drag.getActiveDrag());

	});

	it('should not start dragging before reaching the minimum distance', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			sources: item
		});

		var listener = sinon.stub();
		drag.on(Drag.Events.DRAG, listener);

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 21, 21);
		assert.ok(!drag.isDragging());
		assert.strictEqual(0, listener.callCount);

		DragTestHelper.triggerMouseEvent(document, 'mousemove', 23, 23);
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

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 21, 21);
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

		DragTestHelper.triggerMouseEvent(item1, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(item1, drag.getActiveDrag());

		DragTestHelper.triggerMouseEvent(document, 'mouseup');
		DragTestHelper.triggerMouseEvent(item2, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(item2, drag.getActiveDrag());

		DragTestHelper.triggerMouseEvent(document, 'mouseup');
	});

	it('should handle changing the value of the "sources" attribute', function() {
		var item1 = document.querySelector('.item1');
		var item2 = document.querySelector('.item2');
		drag = new Drag({
			minimumDragDistance: 2,
			sources: item1
		});
		drag.set('sources', item2);

		DragTestHelper.triggerMouseEvent(item1, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(!drag.isDragging());

		DragTestHelper.triggerMouseEvent(item2, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(drag.isDragging());
	});

	it('should not move dragged element if "preventDefault" is called for  "drag" event', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			sources: item
		});
		drag.on(Drag.Events.DRAG, function(data, event) {
			event.preventDefault();
		});

		var initialLeft = item.style.left;
		var initialTop = item.style.top;
		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

		assert.strictEqual(initialLeft, item.style.left);
		assert.strictEqual(initialTop, item.style.top);
	});

	it('should add the "dragging" CSS class to dragged element', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			sources: item
		});

		assert.ok(!dom.hasClass(item, 'dragging'));
		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		assert.ok(!dom.hasClass(item, 'dragging'));
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(dom.hasClass(item, 'dragging'));
		DragTestHelper.triggerMouseEvent(document, 'mouseup');
		assert.ok(!dom.hasClass(item, 'dragging'));
	});

	it('should add the CSS class defined by "draggingClass" to dragged element', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			draggingClass: 'myDraggingClass',
			sources: item
		});

		assert.ok(!dom.hasClass(item, 'myDraggingClass'));
		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		assert.ok(!dom.hasClass(item, 'myDraggingClass'));
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(dom.hasClass(item, 'myDraggingClass'));
		DragTestHelper.triggerMouseEvent(document, 'mouseup');
		assert.ok(!dom.hasClass(item, 'myDraggingClass'));
	});

	it('should disable drag operations', function() {
		var item = document.querySelector('.item');
		drag = new Drag({
			disabled: true,
			sources: item
		});

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
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

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
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

			DragTestHelper.triggerMouseEvent(handle, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
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

			DragTestHelper.triggerMouseEvent(handle, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			assert.ok(drag.isDragging());
		});

		it('should work with multiple sources', function() {
			var item1 = document.querySelector('.item1');
			var item2 = document.querySelector('.item2');
			drag = new Drag({
				handles: '.handle',
				sources: '.item'
			});

			DragTestHelper.triggerMouseEvent(item1.querySelector('.handle'), 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			assert.strictEqual(item1, drag.getActiveDrag());

			dom.on(document, 'mouseup');
			DragTestHelper.triggerMouseEvent(item2.querySelector('.handle'), 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
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
			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

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
			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

			var event = listener.args[0][0];
			assert.strictEqual(item, event.source);
			assert.notStrictEqual(item, event.placeholder);
			assert.ok(dom.hasClass(event.placeholder, 'dragging'));
			assert.strictEqual(initialX + 20 + 'px', event.placeholder.style.left);
			assert.strictEqual(initialY + 30 + 'px', event.placeholder.style.top);
		});

		it('should remove clone from document after drag is over', function() {
			var item = document.querySelector('.item');
			drag = new Drag({
				dragPlaceholder: Drag.Placeholder.CLONE,
				sources: item
			});

			var listener = sinon.stub();
			drag.on(Drag.Events.END, listener);

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			DragTestHelper.triggerMouseEvent(document, 'mouseup');

			assert.ok(!listener.args[0][0].placeholder.parentNode);
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
			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

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
			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

			var event = listener.args[0][0];
			assert.strictEqual(item, event.source);
			assert.strictEqual(placeholder, event.placeholder);
			assert.ok(dom.hasClass(event.placeholder, 'dragging'));
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
			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			DragTestHelper.triggerMouseEvent(document, 'mouseup');
			assert.strictEqual(initialX + 20 + 'px', item.style.left);
			assert.strictEqual(initialY + 30 + 'px', item.style.top);
		});

		it('should not move the source element at the end if "preventDefault" is called for "end" event', function() {
			var item = document.querySelector('.item');
			drag = new Drag({
				dragPlaceholder: Drag.Placeholder.CLONE,
				sources: item
			});
			drag.on(Drag.Events.END, function(data, event) {
				event.preventDefault();
			});

			var initialLeft = item.style.left;
			var initialTop = item.style.top;
			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			DragTestHelper.triggerMouseEvent(document, 'mouseup');

			assert.strictEqual(initialLeft, item.style.left);
			assert.strictEqual(initialTop, item.style.top);
		});
	});

	describe('Scroll', function() {
		beforeEach(function() {
			var html = '<div class="scroll" style="width:200px;height:200px;max-height:20px;overflow-y:scroll;"></div>';
			dom.append(document.body, html);

			var item1 = document.querySelector('.item1');
			item1.style.height = '100px';
			item1.style.width = '200px';
			dom.append(document.querySelector('.scroll'), item1);
		});

		it('should update position of dragged element when document is scrolled', function(done) {
			document.body.style.height = '3000px';
			document.body.style.width = '3000px';
			document.body.style.overflow = 'scroll';

			var item = document.querySelector('.item1');
			drag = new Drag({
				sources: item
			});

			var initialX = item.offsetLeft;
			var initialY = item.offsetTop;

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			drag.once(Drag.Events.DRAG, function(event) {
				assert.strictEqual(initialX + 20, event.x);
				assert.strictEqual(initialY + 40, event.y);
				setTimeout(function() {
					assert.strictEqual(initialX + 20 + 'px', item.style.left);
					assert.strictEqual(initialY + 40 + 'px', item.style.top);

					document.body.scrollTop = 0;
					document.body.scrollLeft = 0;
					dom.once(document, 'scroll', function() {
						document.body.style.height = '';
						document.body.style.width = '';
						document.body.style.overflow = '';
						done();
					});
				}, 0);
			});
			document.body.scrollTop = 10;
		});

		it('should update position of dragged element when scroll container is scrolled', function(done) {
			var scrollNode = document.querySelector('.scroll');
			var item = document.querySelector('.item1');
			drag = new Drag({
				scrollContainers: scrollNode,
				sources: item
			});

			var initialX = item.offsetLeft;
			var initialY = item.offsetTop;

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			drag.once(Drag.Events.DRAG, function(event) {
				assert.strictEqual(initialX + 20, event.x);
				assert.strictEqual(initialY + 40, event.y);
				setTimeout(function() {
					assert.strictEqual(initialX + 20 + 'px', item.style.left);
					assert.strictEqual(initialY + 40 + 'px', item.style.top);
					done();
				}, 0);
			});
			scrollNode.scrollTop = 10;
		});

		it('should update position of dragged element on scroll without moving if "preventDefault" is Called', function(done) {
			var scrollNode = document.querySelector('.scroll');
			var item = document.querySelector('.item1');
			drag = new Drag({
				scrollContainers: scrollNode,
				sources: item
			});
			drag.on(Drag.Events.DRAG, function(data, event) {
				event.preventDefault();
			});

			var initialX = item.offsetLeft;
			var initialY = item.offsetTop;
			var initialLeft = item.style.left;
			var initialTop = item.style.top;

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			drag.once(Drag.Events.DRAG, function(data) {
				assert.strictEqual(initialX + 20, data.x);
				assert.strictEqual(initialY + 40, data.y);
				setTimeout(function() {
					assert.strictEqual(initialLeft, item.style.left);
					assert.strictEqual(initialTop, item.style.top);
					done();
				}, 0);
			});
			scrollNode.scrollTop = 10;
		});

		it('should update position of dragged element on scroll from selector scroll container', function(done) {
			var scrollNode = document.querySelector('.scroll');
			var item = document.querySelector('.item1');
			drag = new Drag({
				scrollContainers: '.scroll',
				sources: item
			});

			var initialX = item.offsetLeft;
			var initialY = item.offsetTop;

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			drag.once(Drag.Events.DRAG, function(event) {
				assert.strictEqual(initialX + 20, event.x);
				assert.strictEqual(initialY + 40, event.y);

				setTimeout(function() {
					assert.strictEqual(initialX + 20 + 'px', item.style.left);
					assert.strictEqual(initialY + 40 + 'px', item.style.top);
					done();
				}, 0);
			});
			scrollNode.scrollTop = 10;
		});
	});

	it('should detach document events when disposed', function() {
		var item = document.querySelector('.item');
		drag = new Drag({
			sources: item
		});

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		drag.dispose();
		assert.doesNotThrow(function() {
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		});
	});
});
