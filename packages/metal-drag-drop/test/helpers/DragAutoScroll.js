'use strict';

import dom from 'bower:metal/src/dom/dom';
import DragAutoScroll from '../../src/helpers/DragAutoScroll';

describe('DragAutoScroll', function() {
	var autoScroll;

	before(function() {
		document.body.style.height = '3000px';
		document.body.style.width = '3000px';
		document.body.style.overflow = 'scroll';
	});

	beforeEach(function() {
		var html = '<div class="scroll" style="width:200px;height:200px;max-height:20px;overflow-y:scroll;">' +
			'<div style="height:100px;width:100px;"></div></div>';
		dom.append(document.body, html);
	});

	afterEach(function(done) {
		autoScroll.dispose();
		document.body.innerHTML = '';
		if (document.body.scrollTop > 0 || document.body.scrollLeft > 0) {
			document.body.scrollTop = 0;
			document.body.scrollLeft = 0;
			dom.once(document, 'scroll', function() {
				done();
			});
		} else {
			done();
		}
	});

	after(function() {
		document.body.style.height = '';
		document.body.style.width = '';
		document.body.style.overflow = '';
	});

	it('should not automatically scroll if mouse is not near boundaries of scroll element', function(done) {
		autoScroll = new DragAutoScroll();

		setTimeout(function() {
			assert.strictEqual(0, document.body.scrollTop);
			assert.strictEqual(0, document.body.scrollLeft);
			done();
		}, 100);
		autoScroll.scroll([document], 30, 30);
	});

	it('should automatically scroll when mouse is near boundaries of the document', function(done) {
		autoScroll = new DragAutoScroll();

		dom.once(document, 'scroll', function() {
			assert.strictEqual(20, document.body.scrollTop);
			assert.strictEqual(0, document.body.scrollLeft);

			autoScroll.scroll([document], window.innerWidth - 10, 30);
			dom.once(document, 'scroll', function() {
				assert.strictEqual(20, document.body.scrollTop);
				assert.strictEqual(20, document.body.scrollLeft);

				autoScroll.scroll([document], 0, 30);
				dom.once(document, 'scroll', function() {
					assert.strictEqual(20, document.body.scrollTop);
					assert.strictEqual(0, document.body.scrollLeft);

					autoScroll.scroll([document], 0, 0);
					dom.once(document, 'scroll', function() {
						assert.strictEqual(0, document.body.scrollTop);
						assert.strictEqual(0, document.body.scrollLeft);
						done();
					});
				});
			});
		});
		autoScroll.scroll([document], 30, window.innerHeight - 10);
	});

	it('should keep scrolling the document while the mouse is near the boundaries', function(done) {
		autoScroll = new DragAutoScroll();

		dom.once(document, 'scroll', function() {
			assert.strictEqual(20, document.body.scrollTop);
			dom.once(document, 'scroll', function() {
				assert.strictEqual(40, document.body.scrollTop);
				dom.once(document, 'scroll', function() {
					assert.strictEqual(60, document.body.scrollTop);
					setTimeout(function() {
						assert.strictEqual(60, document.body.scrollTop);
						done();
					}, 100);
					autoScroll.scroll([document], 30, 30);
				});
			});
		});
		autoScroll.scroll([document], 30, window.innerHeight - 10);
	});

	it('should stop scrolling the document until "stop" is called', function(done) {
		autoScroll = new DragAutoScroll();

		dom.once(document, 'scroll', function() {
			assert.strictEqual(20, document.body.scrollTop);
			setTimeout(function() {
				assert.strictEqual(20, document.body.scrollTop);
				done();
			}, 100);
			autoScroll.stop();
		});
		autoScroll.scroll([document], 30, window.innerHeight - 10);
	});

	it('should automatically scroll when mouse is near boundaries of the given element', function(done) {
		var scrollElement = document.querySelector('.scroll');
		autoScroll = new DragAutoScroll();

		dom.once(scrollElement, 'scroll', function() {
			assert.strictEqual(20, scrollElement.scrollTop);
			done();
		});
		autoScroll.scroll([scrollElement], 10, 10);
	});

	it('should not automatically scroll when mouse is near one of the boundaries but outside element', function(done) {
		var scrollElement = document.querySelector('.scroll');
		autoScroll = new DragAutoScroll();

		setTimeout(function() {
			assert.strictEqual(0, scrollElement.scrollTop);
			done();
		}, 100);
		autoScroll.scroll([scrollElement], 0, 10);
	});

	it('should scroll the number of pixels defined by "speed"', function(done) {
		autoScroll = new DragAutoScroll({
			speed: 30
		});

		dom.once(document, 'scroll', function() {
			assert.strictEqual(30, document.body.scrollTop);
			done();
		});
		autoScroll.scroll([document], 30, window.innerHeight - 10);
	});

	it('should automatically scroll when at least close "maxDistance" pixels to boundaries', function(done) {
		autoScroll = new DragAutoScroll({
			maxDistance: 50
		});

		setTimeout(function() {
			assert.strictEqual(0, document.body.scrollTop);
			dom.once(document, 'scroll', function() {
				assert.strictEqual(20, document.body.scrollTop);
				done();
			});
			autoScroll.scroll([document], 30, window.innerHeight - 50);
		}, 100);
		autoScroll.scroll([document], 30, window.innerHeight - 60);
	});

	it('should not automatically scroll before the ms defined by "delay"', function(done) {
		autoScroll = new DragAutoScroll({
			delay: 100
		});

		setTimeout(function() {
			assert.strictEqual(0, document.body.scrollTop);
			done();
		}, 50);
		autoScroll.scroll([document], 30, window.innerHeight - 10);
	});

	it('should not automatically scroll before the ms defined by "delay"', function(done) {
		autoScroll = new DragAutoScroll({
			delay: 100
		});

		setTimeout(function() {
			assert.strictEqual(20, document.body.scrollTop);
			done();
		}, 110);
		autoScroll.scroll([document], 30, window.innerHeight - 10);
	});
});
