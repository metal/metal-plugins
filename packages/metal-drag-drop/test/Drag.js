'use strict';

import dom from 'metal-dom';
import Drag from '../src/Drag';
import DragShim from '../src/helpers/DragShim';
import DragTestHelper from './fixtures/DragTestHelper';
import Position from 'metal-position';

describe('Drag', function() {
	var drag;
	var item;
	var item2;

	beforeEach(function() {
		var html = '<div class="item" style="position:fixed;top:20px;left:20px;">' +
			'<span class="handle"></span></div>';
		dom.append(document.body, html);

		item = document.querySelector('.item');
		item2 = item.cloneNode(true);
		dom.addClasses(item, 'item1');
		dom.addClasses(item2, 'item2');
		dom.append(document.body, item2);
	});

	afterEach(function() {
		document.body.innerHTML = '';
		DragShim.reset();
		if (drag) {
			drag.dispose();
		}
	});

	it('should drag source to new position', function() {
		drag = new Drag({
			sources: item
		});

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

		assert.strictEqual('40px', item.style.left);
		assert.strictEqual('50px', item.style.top);
	});

	it('should drag source to new position without shim', function() {
		drag = new Drag({
			sources: item,
			useShim: false
		});

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

		assert.strictEqual('40px', item.style.left);
		assert.strictEqual('50px', item.style.top);
	});

	it('should only drag source with left mouse button', function() {
		if ('ontouchstart' in window) {
			// Skip this for touch devices, since they won't use mouse events.
			return;
		}

		drag = new Drag({
			sources: item
		});

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20, 1);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

		assert.strictEqual('20px', item.style.left);
		assert.strictEqual('20px', item.style.top);
	});

	it('should ignore mousedown events during dragging', function() {
		drag = new Drag({
			sources: item
		});

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		DragTestHelper.triggerMouseEvent(item, 'mousedown', 50, 60);

		assert.strictEqual('40px', item.style.left);
		assert.strictEqual('50px', item.style.top);
	});

	it('should emit "drag" event with position info', function() {
		drag = new Drag({
			sources: item
		});

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);

		var listener = sinon.stub();
		drag.on(Drag.Events.DRAG, listener);

		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(1, listener.callCount);
		assert.strictEqual(item, listener.args[0][0].source);
		assert.strictEqual(40, listener.args[0][0].x);
		assert.strictEqual(50, listener.args[0][0].y);

		DragTestHelper.triggerMouseEvent(document, 'mousemove', 30, 60);
		assert.strictEqual(2, listener.callCount);
		assert.strictEqual(item, listener.args[1][0].source);
		assert.strictEqual(30, listener.args[1][0].x);
		assert.strictEqual(60, listener.args[1][0].y);
	});

	it('should emit "end" event when drag ends', function() {
		drag = new Drag({
			sources: item
		});

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

		var listener = sinon.stub();
		drag.on(Drag.Events.END, listener);
		DragTestHelper.triggerMouseEvent(document, 'mouseup');

		assert.strictEqual(1, listener.callCount);
		assert.strictEqual(item, listener.args[0][0].source);
		assert.strictEqual(40, listener.args[0][0].x);
		assert.strictEqual(50, listener.args[0][0].y);
	});

	it('should check if source is being dragged', function() {
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

	it('should emit `dragStart` event when source starts being dragged', function() {
		drag = new Drag({
			sources: item
		});
		var listener = sinon.stub();
		drag.on(Drag.Events.START, listener);

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(1, listener.callCount);
	});

	it('should get the active drag element', function() {
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
		drag = new Drag({
			minimumDragDistance: 2,
			sources: '.item'
		});

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(item, drag.getActiveDrag());

		DragTestHelper.triggerMouseEvent(document, 'mouseup');
		DragTestHelper.triggerMouseEvent(item2, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(item2, drag.getActiveDrag());

		DragTestHelper.triggerMouseEvent(document, 'mouseup');
	});

	it('should only drag sources that match selector inside given container', function() {
		var parent = document.createElement('div');
		dom.replace(item, parent);
		dom.append(parent, item);

		drag = new Drag({
			container: parent,
			minimumDragDistance: 2,
			sources: '.item'
		});

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(item, drag.getActiveDrag());

		DragTestHelper.triggerMouseEvent(document, 'mouseup');
		DragTestHelper.triggerMouseEvent(item2, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(!drag.getActiveDrag());
	});

	it('should handle changing the value of the "sources" state', function() {
		drag = new Drag({
			minimumDragDistance: 2,
			sources: item
		});
		drag.set('sources', item2);

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(!drag.isDragging());

		DragTestHelper.triggerMouseEvent(item2, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(drag.isDragging());
	});

	it('should not move dragged element if "preventDefault" is called for  "drag" event', function() {
		drag = new Drag({
			sources: item
		});
		drag.on(Drag.Events.DRAG, function(data, event) {
			event.preventDefault();
		});

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

		assert.strictEqual('20px', item.style.left);
		assert.strictEqual('20px', item.style.top);
	});

	it('should add the "dragging" CSS class to dragged element', function() {
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

	it('should set the "aria-grabbed" attribute to true for dragged element', function() {
		drag = new Drag({
			sources: item
		});

		assert.ok(!item.getAttribute('aria-grabbed'));
		DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
		assert.ok(!item.getAttribute('aria-grabbed'));
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual('true', item.getAttribute('aria-grabbed'));
		DragTestHelper.triggerMouseEvent(document, 'mouseup');
		assert.strictEqual('false', item.getAttribute('aria-grabbed'));
	});

	it('should disable drag operations', function() {
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
			var handle = item.querySelector('.handle');
			drag = new Drag({
				handles: handle,
				sources: item
			});

			DragTestHelper.triggerMouseEvent(handle, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			assert.ok(drag.isDragging());
			assert.strictEqual(item, drag.getActiveDrag());
			assert.strictEqual(40 + 'px', item.style.left);
			assert.strictEqual(50 + 'px', item.style.top);
		});

		it('should work with handle selectors', function() {
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
			drag = new Drag({
				handles: '.handle',
				sources: '.item'
			});

			DragTestHelper.triggerMouseEvent(item.querySelector('.handle'), 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			assert.strictEqual(item, drag.getActiveDrag());

			dom.on(document, 'mouseup');
			DragTestHelper.triggerMouseEvent(item2.querySelector('.handle'), 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			assert.strictEqual(item2, drag.getActiveDrag());
		});
	});

	describe('Drag Placeholder', function() {
		it('should not move source node if "dragPlaceholder" is set to "clone"', function() {
			drag = new Drag({
				dragPlaceholder: Drag.Placeholder.CLONE,
				sources: item
			});

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

			assert.strictEqual('20px', item.style.left);
			assert.strictEqual('20px', item.style.top);
		});

		it('should move a clone of the source if "dragPlaceholder" is set to "clone"', function() {
			drag = new Drag({
				dragPlaceholder: Drag.Placeholder.CLONE,
				sources: item
			});

			var listener = sinon.stub();
			drag.on(Drag.Events.DRAG, listener);

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

			var event = listener.args[0][0];
			assert.strictEqual(item, event.source);
			assert.notStrictEqual(item, event.placeholder);
			assert.ok(dom.hasClass(event.placeholder, 'dragging'));
			assert.strictEqual(40 + 'px', event.placeholder.style.left);
			assert.strictEqual(50 + 'px', event.placeholder.style.top);
		});

		it('should remove clone from document after drag is over', function() {
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
			drag = new Drag({
				dragPlaceholder: placeholder,
				sources: item
			});

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

			assert.strictEqual('20px', item.style.left);
			assert.strictEqual('20px', item.style.top);
		});

		it('should move the element set as the "dragPlaceholder"', function() {
			var placeholder = document.createElement('div');
			drag = new Drag({
				dragPlaceholder: placeholder,
				sources: item
			});

			var listener = sinon.stub();
			drag.on(Drag.Events.DRAG, listener);

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);

			var event = listener.args[0][0];
			assert.strictEqual(item, event.source);
			assert.strictEqual(placeholder, event.placeholder);
			assert.ok(dom.hasClass(event.placeholder, 'dragging'));
			assert.strictEqual(40 + 'px', placeholder.style.left);
			assert.strictEqual(50 + 'px', placeholder.style.top);
		});

		it('should move the source element at the end even if "dragPlaceholder" is set', function() {
			drag = new Drag({
				dragPlaceholder: Drag.Placeholder.CLONE,
				sources: item
			});

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			DragTestHelper.triggerMouseEvent(document, 'mouseup');
			assert.strictEqual(40 + 'px', item.style.left);
			assert.strictEqual(50 + 'px', item.style.top);
		});

		it('should not move the source element at the end if "preventDefault" is called for "end" event', function() {
			drag = new Drag({
				dragPlaceholder: Drag.Placeholder.CLONE,
				sources: item
			});
			drag.on(Drag.Events.END, function(data, event) {
				event.preventDefault();
			});

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			DragTestHelper.triggerMouseEvent(document, 'mouseup');

			assert.strictEqual('20px', item.style.left);
			assert.strictEqual('20px', item.style.top);
		});
	});

	describe('Scroll', function() {
		beforeEach(function() {
			var html = '<div class="scroll" ' +
				'style="position:relative;width:200px;height:200px;max-height:20px;overflow-y:scroll;"></div>';
			dom.append(document.body, html);

			item.style.position = 'absolute';
			item.style.height = '100px';
			item.style.width = '200px';
			dom.append(document.querySelector('.scroll'), item);
		});

		it('should update position of dragged element when document is scrolled', function(done) {
			document.body.style.height = '3000px';
			document.body.style.width = '3000px';
			document.body.style.overflow = 'scroll';

			drag = new Drag({
				sources: item
			});

			var initialRegion = Position.getRegion(item);
			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			drag.once(Drag.Events.DRAG, function(event) {
				assert.strictEqual(initialRegion.left + 20, event.x);
				assert.strictEqual(initialRegion.top + 40, event.y);
				assert.strictEqual(40, event.relativeX);
				assert.strictEqual(60, event.relativeY);
				setTimeout(function() {
					assert.strictEqual(40 + 'px', item.style.left);
					assert.strictEqual(60 + 'px', item.style.top);

					dom.once(document, 'scroll', function() {
						document.body.style.height = '';
						document.body.style.width = '';
						document.body.style.overflow = '';
						done();
					});
					window.scrollTo(0, 0);
				}, 0);
			});
			window.scrollTo(0, 10);
		});

		it('should update position of dragged element when scroll container is scrolled', function(done) {
			var scrollNode = document.querySelector('.scroll');
			drag = new Drag({
				scrollContainers: scrollNode,
				sources: item
			});

			var initialRegion = Position.getRegion(item);
			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			drag.once(Drag.Events.DRAG, function(event) {
				assert.strictEqual(initialRegion.left + 20, event.x);
				assert.strictEqual(initialRegion.top + 40, event.y);
				assert.strictEqual(40, event.relativeX);
				assert.strictEqual(60, event.relativeY);
				setTimeout(function() {
					assert.strictEqual(40 + 'px', item.style.left);
					assert.strictEqual(60 + 'px', item.style.top);
					done();
				}, 0);
			});
			scrollNode.scrollTop = 10;
		});

		it('should update position of dragged element on scroll without moving if "preventDefault" is Called', function(done) {
			var scrollNode = document.querySelector('.scroll');
			drag = new Drag({
				scrollContainers: scrollNode,
				sources: item
			});
			drag.on(Drag.Events.DRAG, function(data, event) {
				event.preventDefault();
			});

			var initialRegion = Position.getRegion(item);
			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			drag.once(Drag.Events.DRAG, function(data) {
				assert.strictEqual(initialRegion.left + 20, data.x);
				assert.strictEqual(initialRegion.top + 40, data.y);
				assert.strictEqual(40, data.relativeX);
				assert.strictEqual(60, data.relativeY);
				setTimeout(function() {
					assert.strictEqual('20px', item.style.left);
					assert.strictEqual('20px', item.style.top);
					done();
				}, 0);
			});
			scrollNode.scrollTop = 10;
		});

		it('should update position of dragged element on scroll from selector scroll container', function(done) {
			var scrollNode = document.querySelector('.scroll');
			drag = new Drag({
				scrollContainers: '.scroll',
				sources: item
			});

			var initialRegion = Position.getRegion(item);
			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
			drag.once(Drag.Events.DRAG, function(data) {
				assert.strictEqual(initialRegion.left + 20, data.x);
				assert.strictEqual(initialRegion.top + 40, data.y);
				assert.strictEqual(40, data.relativeX);
				assert.strictEqual(60, data.relativeY);

				setTimeout(function() {
					assert.strictEqual(40 + 'px', item.style.left);
					assert.strictEqual(60 + 'px', item.style.top);
					done();
				}, 0);
			});
			scrollNode.scrollTop = 10;
		});

		it('should convert "scrollContainers" given as selector into elements', function() {
			var scroll = document.querySelector('.scroll');
			var scroll2 = scroll.cloneNode(true);
			dom.enterDocument(scroll2);

			drag = new Drag({
				scrollContainers: '.scroll',
				sources: item
			});

			assert.deepEqual([scroll, scroll2, document], drag.scrollContainers);
		});

		it('should ignore elements that match "scrollContainers" selector that are outside "container"', function() {
			var scroll = document.querySelector('.scroll');
			var scroll2 = scroll.cloneNode(true);
			var parent = document.createElement('div');
			dom.append(parent, scroll2);
			dom.enterDocument(parent);

			drag = new Drag({
				container: parent,
				scrollContainers: '.scroll',
				sources: item
			});

			assert.deepEqual([scroll2, document], drag.scrollContainers);
		});

		it('should auto scroll the document when dragging near boundaries', function(done) {
			document.body.style.height = '3000px';
			document.body.style.overflow = 'scroll';

			drag = new Drag({
				autoScroll: true,
				sources: item
			});

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 20, window.innerHeight);
			dom.once(document, 'scroll', function() {
				assert.strictEqual(20, Position.getScrollTop(document));

				DragTestHelper.triggerMouseEvent(document, 'mouseup');
				dom.once(document, 'scroll', function() {
					document.body.style.height = '';
					document.body.style.overflow = '';
					done();
				});
				window.scrollTo(0, 0);
			});
		});

		it('should auto scroll a container when dragging near boundaries', function(done) {
			var scroll = document.querySelector('.scroll');
			drag = new Drag({
				autoScroll: true,
				scrollContainers: '.scroll',
				sources: item
			});

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 10);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 20, 15);
			dom.once(scroll, 'scroll', function() {
				assert.strictEqual(20, scroll.scrollTop);
				DragTestHelper.triggerMouseEvent(document, 'mouseup');
				done();
			});
		});

		it('should not auto scroll if "autoScroll" is not set', function(done) {
			var scroll = document.querySelector('.scroll');
			drag = new Drag({
				scrollContainers: '.scroll',
				sources: item
			});

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 10);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 20, 15);
			setTimeout(function() {
				assert.strictEqual(0, scroll.scrollTop);
				done();
			}, 100);
		});
	});

	describe('Constrain', function() {
		beforeEach(function() {
			item.style.position = 'absolute';
			item.style.top = '20px';
			item.style.left = '20px';
			item.style.height = '20px';
			item.style.width = '20px';

			var container = document.createElement('div');
			container.style.width = '100px';
			container.style.height = '100px';
			dom.addClasses(container, 'container');
			dom.append(container, item);
			dom.append(document.body, container);
		});

		it('should only drag item within the limits defined by the "constrain" object', function() {
			drag = new Drag({
				constrain: {
					bottom: 60,
					left: 0,
					right: 60,
					top: 0
				},
				sources: item
			});

			var listener = sinon.stub();
			drag.on(Drag.Events.DRAG, listener);

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 30, 30);
			assert.strictEqual(1, listener.callCount);
			assert.strictEqual(30, listener.args[0][0].x);
			assert.strictEqual(30, listener.args[0][0].y);

			DragTestHelper.triggerMouseEvent(document, 'mousemove', 60, 50);
			assert.strictEqual(2, listener.callCount);
			assert.strictEqual(40, listener.args[1][0].x);
			assert.strictEqual(40, listener.args[1][0].y);

			DragTestHelper.triggerMouseEvent(document, 'mousemove', -10, -20);
			assert.strictEqual(3, listener.callCount);
			assert.strictEqual(0, listener.args[2][0].x);
			assert.strictEqual(0, listener.args[2][0].y);
		});

		it('should only drag item within the limits defined by the "constrain" element', function() {
			drag = new Drag({
				constrain: document.querySelector('.container'),
				sources: item
			});

			var listener = sinon.stub();
			drag.on(Drag.Events.DRAG, listener);
			var containerRegion = Position.getRegion(drag.constrain);

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 30, 30);
			assert.strictEqual(1, listener.callCount);
			assert.strictEqual(30, listener.args[0][0].x);
			assert.strictEqual(30, listener.args[0][0].y);

			DragTestHelper.triggerMouseEvent(document, 'mousemove', 230, 230);
			assert.strictEqual(2, listener.callCount);
			assert.strictEqual(containerRegion.right - 20, listener.args[1][0].x);
			assert.strictEqual(containerRegion.bottom - 20, listener.args[1][0].y);
		});

		it('should only drag item within the limits defined by the "constrain" selector', function() {
			drag = new Drag({
				constrain: '.container',
				sources: item
			});

			var listener = sinon.stub();
			drag.on(Drag.Events.DRAG, listener);
			var containerRegion = Position.getRegion(drag.constrain);

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 30, 30);
			assert.strictEqual(1, listener.callCount);
			assert.strictEqual(30, listener.args[0][0].x);
			assert.strictEqual(30, listener.args[0][0].y);

			DragTestHelper.triggerMouseEvent(document, 'mousemove', 230, 230);
			assert.strictEqual(2, listener.callCount);
			assert.strictEqual(containerRegion.right - 20, listener.args[1][0].x);
			assert.strictEqual(containerRegion.bottom - 20, listener.args[1][0].y);
		});

		it('should only drag item within the limits defined by the "constrain" object', function() {
			drag = new Drag({
				constrain: function(region) {
					var width = region.right - region.left;
					var right = Math.min(region.right, 60);
					return {
						bottom: region.botton,
						left: right - width,
						right: right,
						top: region.top
					};
				},
				sources: item
			});

			var listener = sinon.stub();
			drag.on(Drag.Events.DRAG, listener);

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 30, 30);
			assert.strictEqual(1, listener.callCount);
			assert.strictEqual(30, listener.args[0][0].x);
			assert.strictEqual(30, listener.args[0][0].y);

			DragTestHelper.triggerMouseEvent(document, 'mousemove', 60, 50);
			assert.strictEqual(2, listener.callCount);
			assert.strictEqual(40, listener.args[1][0].x);
			assert.strictEqual(50, listener.args[1][0].y);
		});

		it('should only continue dragging item when the mouse returns to previous position inside the "constrain" limits', function() {
			drag = new Drag({
				constrain: {
					bottom: 60,
					left: 0,
					right: 60,
					top: 0
				},
				sources: item
			});

			var listener = sinon.stub();
			drag.on(Drag.Events.DRAG, listener);

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 30, 30);
			assert.strictEqual(1, listener.callCount);
			assert.strictEqual(30, listener.args[0][0].x);
			assert.strictEqual(30, listener.args[0][0].y);

			DragTestHelper.triggerMouseEvent(document, 'mousemove', 60, 50);
			assert.strictEqual(2, listener.callCount);
			assert.strictEqual(40, listener.args[1][0].x);
			assert.strictEqual(40, listener.args[1][0].y);

			DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 40);
			assert.strictEqual(2, listener.callCount);

			DragTestHelper.triggerMouseEvent(document, 'mousemove', 30, 30);
			assert.strictEqual(3, listener.callCount);
			assert.strictEqual(30, listener.args[2][0].x);
			assert.strictEqual(30, listener.args[2][0].y);
		});

		it('should keep constraining drag to element after scrolling', function(done) {
			document.body.style.height = '3000px';

			drag = new Drag({
				constrain: '.container',
				sources: item
			});

			var containerRegion = Position.getRegion(drag.constrain);
			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 30, 30);

			drag.once(Drag.Events.DRAG, function(data) {
				assert.strictEqual(30, data.x);
				assert.strictEqual(containerRegion.bottom - 20, data.y);

				window.scrollTo(0, 0);
				drag.once(Drag.Events.DRAG, function() {
					document.body.style.height = '';
					done();
				});
			});
			window.scrollTo(0, 200);
		});
	});

	describe('Axis', function() {
		it('should only drag horizontally if "axis" is set to "x"', function() {
			drag = new Drag({
				axis: 'x',
				sources: item
			});

			var listener = sinon.stub();
			drag.once(Drag.Events.DRAG, listener);

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 30, 30);

			assert.strictEqual(1, listener.callCount);
			assert.strictEqual(30, listener.args[0][0].x);
			assert.strictEqual(20, listener.args[0][0].y);
		});

		it('should only drag verically if "axis" is set to "y"', function() {
			drag = new Drag({
				axis: 'y',
				sources: item
			});

			var listener = sinon.stub();
			drag.once(Drag.Events.DRAG, listener);

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 30, 30);

			assert.strictEqual(1, listener.callCount);
			assert.strictEqual(20, listener.args[0][0].x);
			assert.strictEqual(30, listener.args[0][0].y);
		});

		it('should not emit "drag" event if element did not move', function() {
			drag = new Drag({
				axis: 'y',
				sources: item
			});

			var listener = sinon.stub();
			drag.once(Drag.Events.DRAG, listener);

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 30, 20);

			assert.strictEqual(0, listener.callCount);
		});
	});

	describe('Steps', function() {
		it('should only move the dragged element by multiples of the values defined in "steps" state', function() {
			drag = new Drag({
				sources: item,
				steps: {
					x: 50,
					y: 100
				}
			});

			var listener = sinon.stub();
			drag.on(Drag.Events.DRAG, listener);

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 20, 20);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 30, 30);
			assert.strictEqual(0, listener.callCount);

			DragTestHelper.triggerMouseEvent(document, 'mousemove', 80, 80);
			assert.strictEqual(1, listener.callCount);
			assert.strictEqual(70, listener.args[0][0].x);
			assert.strictEqual(20, listener.args[0][0].y);

			DragTestHelper.triggerMouseEvent(document, 'mousemove', 90, 130);
			assert.strictEqual(2, listener.callCount);
			assert.strictEqual(70, listener.args[1][0].x);
			assert.strictEqual(120, listener.args[1][0].y);
		});
	});

	describe('Keyboard', function() {
		it('should start drag operation when ENTER key is pressed on source', function() {
			drag = new Drag({
				sources: item
			});

			DragTestHelper.triggerKeyEvent(item, 13);
			assert.ok(drag.isDragging());
			assert.strictEqual(item, drag.getActiveDrag());
		});

		it('should not start drag operation when ENTER key is pressed on non source element', function() {
			drag = new Drag({
				sources: item
			});

			DragTestHelper.triggerKeyEvent(document.body, 13);
			assert.ok(!drag.isDragging());
		});

		it('should start drag operation when SPACE key is pressed', function() {
			drag = new Drag({
				sources: item
			});

			DragTestHelper.triggerKeyEvent(item, 32);
			assert.ok(drag.isDragging());
			assert.strictEqual(item, drag.getActiveDrag());
		});

		it('should not start drag operation when SPACE key is pressed on non source element', function() {
			drag = new Drag({
				sources: item
			});

			DragTestHelper.triggerKeyEvent(document.body, 32);
			assert.ok(!drag.isDragging());
		});

		it('should end drag operation when ENTER key is pressed on source', function() {
			drag = new Drag({
				sources: item
			});

			DragTestHelper.triggerKeyEvent(item, 13);
			DragTestHelper.triggerKeyEvent(item, 13);
			assert.ok(!drag.isDragging());
		});

		it('should not end drag operation when ENTER key is pressed on non source element', function() {
			drag = new Drag({
				sources: item
			});

			DragTestHelper.triggerKeyEvent(item, 13);
			DragTestHelper.triggerKeyEvent(document.body, 13);
			assert.ok(drag.isDragging());
		});

		it('should end drag operation when SPACE key is pressed on source', function() {
			drag = new Drag({
				sources: item
			});

			DragTestHelper.triggerKeyEvent(item, 13);
			DragTestHelper.triggerKeyEvent(item, 32);
			assert.ok(!drag.isDragging());
		});

		it('should not end drag operation when SPACE key is pressed on non source element', function() {
			drag = new Drag({
				sources: item
			});

			DragTestHelper.triggerKeyEvent(item, 13);
			DragTestHelper.triggerKeyEvent(document.body, 32);
			assert.ok(drag.isDragging());
		});

		it('should end drag operation when ESC key is pressed on source', function() {
			drag = new Drag({
				sources: item
			});

			DragTestHelper.triggerKeyEvent(item, 13);
			DragTestHelper.triggerKeyEvent(item, 27);
			assert.ok(!drag.isDragging());
		});

		it('should end drag operation when ESC key is pressed on non source element', function() {
			drag = new Drag({
				sources: item
			});

			DragTestHelper.triggerKeyEvent(item, 13);
			DragTestHelper.triggerKeyEvent(document.body, 27);
			assert.ok(!drag.isDragging());
		});

		it('should move source during drag when arrow keys are pressed', function() {
			drag = new Drag({
				sources: item
			});

			DragTestHelper.triggerKeyEvent(item, 13);
			DragTestHelper.triggerKeyEvent(item, 37);
			assert.strictEqual('10px', item.style.left);
			assert.strictEqual('20px', item.style.top);

			DragTestHelper.triggerKeyEvent(item, 38);
			assert.strictEqual('10px', item.style.left);
			assert.strictEqual('10px', item.style.top);

			DragTestHelper.triggerKeyEvent(item, 39);
			assert.strictEqual('20px', item.style.left);
			assert.strictEqual('10px', item.style.top);

			DragTestHelper.triggerKeyEvent(item, 40);
			assert.strictEqual('20px', item.style.left);
			assert.strictEqual('20px', item.style.top);
		});

		it('should move source through arrows according to given speed', function() {
			drag = new Drag({
				keyboardSpeed: 20,
				sources: item
			});

			DragTestHelper.triggerKeyEvent(item, 13);
			DragTestHelper.triggerKeyEvent(item, 37);
			assert.strictEqual('0px', item.style.left);
			assert.strictEqual('20px', item.style.top);

			DragTestHelper.triggerKeyEvent(item, 38);
			assert.strictEqual('0px', item.style.left);
			assert.strictEqual('0px', item.style.top);

			DragTestHelper.triggerKeyEvent(item, 39);
			assert.strictEqual('20px', item.style.left);
			assert.strictEqual('0px', item.style.top);

			DragTestHelper.triggerKeyEvent(item, 40);
			assert.strictEqual('20px', item.style.left);
			assert.strictEqual('20px', item.style.top);
		});

		it('should move source through arrows according to "steps" if "keyboardSpeed" is too small', function() {
			drag = new Drag({
				sources: item,
				steps: {
					x: 30,
					y: 40
				}
			});

			DragTestHelper.triggerKeyEvent(item, 13);
			DragTestHelper.triggerKeyEvent(item, 37);
			assert.strictEqual('-10px', item.style.left);
			assert.strictEqual('20px', item.style.top);

			DragTestHelper.triggerKeyEvent(item, 38);
			assert.strictEqual('-10px', item.style.left);
			assert.strictEqual('-20px', item.style.top);

			DragTestHelper.triggerKeyEvent(item, 39);
			assert.strictEqual('20px', item.style.left);
			assert.strictEqual('-20px', item.style.top);

			DragTestHelper.triggerKeyEvent(item, 40);
			assert.strictEqual('20px', item.style.left);
			assert.strictEqual('20px', item.style.top);
		});

		it('should not move source if it\'s not being dragged', function() {
			drag = new Drag({
				sources: item
			});

			DragTestHelper.triggerKeyEvent(item, 37);
			assert.strictEqual('20px', item.style.left);
			assert.strictEqual('20px', item.style.top);
		});

		it('should not move source if arrow keys are pressed on another element', function() {
			drag = new Drag({
				sources: '.item'
			});

			DragTestHelper.triggerKeyEvent(item, 13);
			DragTestHelper.triggerKeyEvent(item2, 37);
			assert.strictEqual('20px', item.style.left);
			assert.strictEqual('20px', item.style.top);
		});

		it('should neither end nor move source if unsupported key is pressed', function() {
			drag = new Drag({
				sources: '.item'
			});

			DragTestHelper.triggerKeyEvent(item, 13);

			DragTestHelper.triggerKeyEvent(item, 10);
			assert.ok(drag.isDragging());
			assert.strictEqual('20px', item.style.left);
			assert.strictEqual('20px', item.style.top);
		});

	});

	it('should detach document events when disposed', function() {
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
