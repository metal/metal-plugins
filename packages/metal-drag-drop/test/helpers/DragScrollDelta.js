'use strict';

import dom from 'metal-dom';
import DragScrollDelta from '../../src/helpers/DragScrollDelta';
import Position from 'metal-position';

describe('DragScrollDelta', function() {
	var dragScrollDelta;

	before(function() {
		document.body.style.height = '3000px';
		document.body.style.width = '3000px';
		document.body.style.overflow = 'scroll';
	});

	beforeEach(function() {
		var html = '<div class="scroll" style="width:200px;height:200px;max-height:20px;overflow-y:scroll;">' +
			'<div class="dragNode" style="height:100px;width:100px;"></div></div>';
		dom.append(document.body, html);
	});

	afterEach(function(done) {
		dragScrollDelta.dispose();
		document.body.innerHTML = '';
		if (Position.getScrollTop(document) > 0 || Position.getScrollLeft(document) > 0) {
			dom.once(document, 'scroll', function() {
				done();
			});
			window.scrollTo(0, 0);
		} else {
			done();
		}
	});

	after(function() {
		document.body.style.height = '';
		document.body.style.width = '';
		document.body.style.overflow = '';
	});

	it('should emit "scrollDelta" event when the body is scrolled', function(done) {
		dragScrollDelta = new DragScrollDelta();
		dragScrollDelta.start(document.querySelector('.dragNode'), [document]);

		dragScrollDelta.once('scrollDelta', function(event) {
			assert.strictEqual(0, event.deltaX);
			assert.strictEqual(10, event.deltaY);

			dragScrollDelta.once('scrollDelta', function(event) {
				assert.strictEqual(20, event.deltaX);
				assert.strictEqual(0, event.deltaY);
				done();
			});
			window.scrollTo(20, 10);
		});
		window.scrollTo(0, 10);
	});

	it('should emit "scrollDelta" event when a container is scrolled', function(done) {
		var scrollNode = document.querySelector('.scroll');
		dragScrollDelta = new DragScrollDelta();
		dragScrollDelta.start(document.querySelector('.dragNode'), [scrollNode]);

		dragScrollDelta.once('scrollDelta', function(event) {
			assert.strictEqual(0, event.deltaX);
			assert.strictEqual(10, event.deltaY);
			done();
		});
		scrollNode.scrollTop = 10;
	});

	it('should not emit "scrollDelta" event if scrolled element does not contain drag node', function(done) {
		var scrollNode = document.querySelector('.scroll');
		var anotherDragNode = document.querySelector('.dragNode').cloneNode(true);
		dom.enterDocument(anotherDragNode);
		dragScrollDelta = new DragScrollDelta();
		dragScrollDelta.start(anotherDragNode, [scrollNode]);

		var listener = sinon.stub();
		dragScrollDelta.once('scrollDelta', listener);

		dom.once(scrollNode, 'scroll', function() {
			assert.strictEqual(0, listener.callCount);
			done();
		});
		scrollNode.scrollTop = 10;
	});

	it('should not emit "scrollDelta" event if drag node has "fixed" position', function(done) {
		var dragNode = document.querySelector('.dragNode');
		dragNode.style.position = 'fixed';

		dragScrollDelta = new DragScrollDelta();
		dragScrollDelta.start(dragNode, [document]);

		var listener = sinon.stub();
		dragScrollDelta.once('scrollDelta', listener);

		dom.once(document, 'scroll', function() {
			assert.strictEqual(0, listener.callCount);
			done();
		});
		window.scrollTo(0, 10);
	});

	it('should not emit "scrollDelta" event if "stop" is called', function(done) {
		var scrollNode = document.querySelector('.scroll');
		dragScrollDelta = new DragScrollDelta();
		dragScrollDelta.start(document.querySelector('.dragNode'), [scrollNode]);

		var listener = sinon.stub();
		dragScrollDelta.once('scrollDelta', listener);
		dragScrollDelta.stop();

		dom.once(scrollNode, 'scroll', function() {
			assert.strictEqual(0, listener.callCount);
			done();
		});
		scrollNode.scrollTop = 10;
	});

	it('should not emit "scrollDelta" event if "dispose" is called', function(done) {
		var scrollNode = document.querySelector('.scroll');
		dragScrollDelta = new DragScrollDelta();
		dragScrollDelta.start(document.querySelector('.dragNode'), [scrollNode]);

		var listener = sinon.stub();
		dragScrollDelta.once('scrollDelta', listener);
		dragScrollDelta.dispose();

		dom.once(scrollNode, 'scroll', function() {
			assert.strictEqual(0, listener.callCount);
			done();
		});
		scrollNode.scrollTop = 10;
	});
});
