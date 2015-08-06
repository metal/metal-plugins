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

	it('should handle changing the value of the "sources" attribute', function() {
		var item1 = document.querySelector('.item1');
		var item2 = document.querySelector('.item2');
		drag = new Drag({
			minimumDragDistance: 2,
			sources: item1
		});
		drag.set('sources', item2);

		triggerMouseEvent(item1, 'mousedown', 20, 20);
		triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(!drag.isDragging());

		triggerMouseEvent(item2, 'mousedown', 20, 20);
		triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(drag.isDragging());
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

	it('should add the "dragging" CSS class to dragged element', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			sources: item
		});

		assert.ok(!dom.hasClass(item, 'dragging'));
		triggerMouseEvent(item, 'mousedown', 20, 20);
		assert.ok(!dom.hasClass(item, 'dragging'));
		triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(dom.hasClass(item, 'dragging'));
		dom.triggerEvent(document, 'mouseup');
		assert.ok(!dom.hasClass(item, 'dragging'));
	});

	it('should add the CSS class defined by "draggingClass" to dragged element', function() {
		var item = document.querySelector('.item1');
		drag = new Drag({
			draggingClass: 'myDraggingClass',
			sources: item
		});

		assert.ok(!dom.hasClass(item, 'myDraggingClass'));
		triggerMouseEvent(item, 'mousedown', 20, 20);
		assert.ok(!dom.hasClass(item, 'myDraggingClass'));
		triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(dom.hasClass(item, 'myDraggingClass'));
		dom.triggerEvent(document, 'mouseup');
		assert.ok(!dom.hasClass(item, 'myDraggingClass'));
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

			triggerMouseEvent(item, 'mousedown', 20, 20);
			triggerMouseEvent(document, 'mousemove', 40, 50);
			dom.triggerEvent(document, 'mouseup');

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

	describe('Scroll', function() {
		beforeEach(function() {
			var html = '<div class="scroll" style="width:200px;height:200px;max-height:20px;overflow-y:scroll;"></div>';
			dom.append(document.body, html);

			var item1 = document.querySelector('.item1');
			item1.style.height = '100px';
			item1.style.width = '200px';
			dom.append(document.querySelector('.scroll'), item1);
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

			triggerMouseEvent(item, 'mousedown', 20, 20);
			triggerMouseEvent(document, 'mousemove', 40, 50);
			drag.once(Drag.Events.DRAG, function(event) {
				assert.strictEqual(initialX + 20, event.x);
				assert.strictEqual(initialY + 40, event.y);
				assert.strictEqual(initialX + 20 + 'px', item.style.left);
				assert.strictEqual(initialY + 40 + 'px', item.style.top);
				done();
			});
			scrollNode.scrollTop = 10;
		});

		it('should update position of dragged element on scroll without moving if "move" is false', function(done) {
			var scrollNode = document.querySelector('.scroll');
			var item = document.querySelector('.item1');
			drag = new Drag({
				move: false,
				scrollContainers: scrollNode,
				sources: item
			});

			var initialX = item.offsetLeft;
			var initialY = item.offsetTop;
			var initialLeft = item.style.left;
			var initialTop = item.style.top;

			triggerMouseEvent(item, 'mousedown', 20, 20);
			triggerMouseEvent(document, 'mousemove', 40, 50);
			drag.once(Drag.Events.DRAG, function(event) {
				assert.strictEqual(initialX + 20, event.x);
				assert.strictEqual(initialY + 40, event.y);
				assert.strictEqual(initialLeft, item.style.left);
				assert.strictEqual(initialTop, item.style.top);
				done();
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

			triggerMouseEvent(item, 'mousedown', 20, 20);
			triggerMouseEvent(document, 'mousemove', 40, 50);
			drag.once(Drag.Events.DRAG, function(event) {
				assert.strictEqual(initialX + 20, event.x);
				assert.strictEqual(initialY + 40, event.y);
				assert.strictEqual(initialX + 20 + 'px', item.style.left);
				assert.strictEqual(initialY + 40 + 'px', item.style.top);
				done();
			});
			scrollNode.scrollTop = 10;
		});
	});

	it('should detach document events when disposed', function() {
		var item = document.querySelector('.item');
		drag = new Drag({
			sources: item
		});

		triggerMouseEvent(item, 'mousedown', 20, 20);
		drag.dispose();
		assert.doesNotThrow(function() {
			triggerMouseEvent(document, 'mousemove', 40, 50);
		});
	});

	function triggerMouseEvent(target, eventType, x, y) {
		var data = {
			clientX: x,
			clientY: y
		};
		if ('ontouchstart' in window) {
			eventType = eventType === 'mousedown' ? 'touchstart' : 'touchmove';
			data = {
				targetTouches: [data]
			};
		}
		dom.triggerEvent(target, eventType, data);
	}
});
