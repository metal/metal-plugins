'use strict';

import dom from 'bower:metal/src/dom/dom';
import DragScrollDelta from '../src/helpers/DragScrollDelta';

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
		if (document.body.scrollTop > 0 || document.body.scrollLeft > 0) {
			document.body.scrollTop = 0;
			document.body.scrollLeft = 0;
			dom.on(document, 'scroll', function() {
				done();
			});
		} else {
			done();
		}
	});

	after(function() {
		document.body.scrollTop = 0;
		document.body.scrollLeft = 0;
		document.body.style.height = '';
		document.body.style.width = '';
		document.body.style.overflow = '';
	});

	it('should emit "scrollDelta" event when the body is scrolled', function(done) {
		dragScrollDelta = new DragScrollDelta();
		dragScrollDelta.start(document.querySelector('.dragNode'));

		dragScrollDelta.once('scrollDelta', function(event) {
			assert.strictEqual(0, event.deltaX);
			assert.strictEqual(10, event.deltaY);

			document.body.scrollLeft = 20;
			dragScrollDelta.once('scrollDelta', function(event) {
				assert.strictEqual(20, event.deltaX);
				assert.strictEqual(0, event.deltaY);
				done();
			});
		});
		document.body.scrollTop = 10;
	});

	it('should emit "scrollDelta" event when a container is scrolled', function(done) {
		var scrollNode = document.querySelector('.scroll');
		dragScrollDelta = new DragScrollDelta();
		dragScrollDelta.start(document.querySelector('.dragNode'), scrollNode);

		dragScrollDelta.once('scrollDelta', function(event) {
			assert.strictEqual(0, event.deltaX);
			assert.strictEqual(10, event.deltaY);
			done();
		});
		scrollNode.scrollTop = 10;
	});

	it('should emit "scrollDelta" event when a container matching given selector is scrolled', function(done) {
		var scrollNode = document.querySelector('.scroll');
		dragScrollDelta = new DragScrollDelta();
		dragScrollDelta.start(document.querySelector('.dragNode'), '.scroll');

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
		dragScrollDelta.start(anotherDragNode, '.scroll');

		var listener = sinon.stub();
		dragScrollDelta.once('scrollDelta', listener);

		dom.once(scrollNode, 'scroll', function() {
			assert.strictEqual(0, listener.callCount);
			done();
		});
		scrollNode.scrollTop = 10;
	});

	it('should not emit "scrollDelta" event if scrolled element does not match selector', function(done) {
		var scrollNode = document.querySelector('.scroll');
		dom.removeClasses(scrollNode, 'scroll');
		dragScrollDelta = new DragScrollDelta();
		dragScrollDelta.start(document.querySelector('.dragNode'), '.scroll');

		var listener = sinon.stub();
		dragScrollDelta.once('scrollDelta', listener);

		dom.once(scrollNode, 'scroll', function() {
			assert.strictEqual(0, listener.callCount);
			done();
		});
		scrollNode.scrollTop = 10;
	});

	it('should not emit "scrollDelta" event if "stop" is called', function(done) {
		var scrollNode = document.querySelector('.scroll');
		dragScrollDelta = new DragScrollDelta();
		dragScrollDelta.start(document.querySelector('.dragNode'), '.scroll');

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
		dragScrollDelta.start(document.querySelector('.dragNode'), '.scroll');

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
