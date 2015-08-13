'use strict';

import dom from 'bower:metal/src/dom/dom';
import DragDrop from '../src/DragDrop';
import DragShim from '../src/helpers/DragShim';
import DragTestHelper from './fixtures/DragTestHelper';

describe('DragDrop', function() {
	var dragDrop;
	var item;
	var target;
	var target2;

	beforeEach(function() {
		var html = '<div class="item"></div><div class="target"></div>';
		dom.append(document.body, html);

		item = document.querySelector('.item');
		target = document.querySelector('.target');
		target.style.position = 'absolute';
		target.style.top = '10px';
		target.style.left = '20px';
		target.style.height = '100px';
		target.style.width = '200px';

		target2 = target.cloneNode(true);
		target2.style.left = '250px';
		dom.append(document.body, target2);

		DragShim.reset();
	});

	afterEach(function() {
		document.body.innerHTML = '';
		dragDrop.dispose();
	});

	it('should add "targetOver" class when dragged element is on top of target', function() {
		dragDrop = new DragDrop({
			sources: item,
			targets: target
		});
		assert.ok(!dom.hasClass(target, 'targetOver'));

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 0, 0);
		assert.ok(!dom.hasClass(target, 'targetOver'));

		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(dom.hasClass(target, 'targetOver'));

		DragTestHelper.triggerMouseEvent(document, 'mouseup');
		assert.ok(!dom.hasClass(target, 'targetOver'));
	});

	it('should add class defined by "targetOverClass" when dragged element is on top of target', function() {
		dragDrop = new DragDrop({
			sources: item,
			targetOverClass: 'myOverClass',
			targets: target
		});
		assert.ok(!dom.hasClass(target, 'myOverClass'));

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 0, 0);
		assert.ok(!dom.hasClass(target, 'myOverClass'));

		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(dom.hasClass(target, 'myOverClass'));

		DragTestHelper.triggerMouseEvent(document, 'mouseup');
		assert.ok(!dom.hasClass(target, 'myOverClass'));
	});

	it('should not add target class to target if mouse is not moved over it', function() {
		dragDrop = new DragDrop({
			sources: item,
			targets: target
		});

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 0, 0);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 5, 10);
		assert.ok(!dom.hasClass(target, 'targetOver'));
	});

	it('should add "targetOver" class on correct target when there are multiple', function() {
		dragDrop = new DragDrop({
			sources: item,
			targets: '.target'
		});

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 0, 0);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.ok(dom.hasClass(target, 'targetOver'));
		assert.ok(!dom.hasClass(target2, 'targetOver'));

		DragTestHelper.triggerMouseEvent(document, 'mousemove', 260, 50);
		assert.ok(!dom.hasClass(target, 'targetOver'));
		assert.ok(dom.hasClass(target2, 'targetOver'));
	});

	it('should trigger "targetEnter" event when mouse enters target', function() {
		dragDrop = new DragDrop({
			sources: item,
			targets: '.target'
		});

		var listener = sinon.stub();
		dragDrop.on(DragDrop.Events.TARGET_ENTER, listener);

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 0, 0);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(1, listener.callCount);
		assert.strictEqual(target, listener.args[0][0].target);
		assert.deepEqual([target], listener.args[0][0].allActiveTargets);

		DragTestHelper.triggerMouseEvent(document, 'mousemove', 260, 50);
		assert.strictEqual(2, listener.callCount);
		assert.strictEqual(target2, listener.args[1][0].target);
		assert.deepEqual([target2], listener.args[1][0].allActiveTargets);

		DragTestHelper.triggerMouseEvent(document, 'mousemove', 5, 10);
		assert.strictEqual(2, listener.callCount);

	});

	it('should trigger "targetLeave" event when mouse leaves target', function() {
		dragDrop = new DragDrop({
			sources: item,
			targets: '.target'
		});

		var listener = sinon.stub();
		dragDrop.on(DragDrop.Events.TARGET_LEAVE, listener);

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 0, 0);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 50);
		assert.strictEqual(0, listener.callCount);

		DragTestHelper.triggerMouseEvent(document, 'mousemove', 260, 50);
		assert.strictEqual(1, listener.callCount);
		assert.strictEqual(target, listener.args[0][0].target);
		assert.deepEqual([target], listener.args[0][0].allActiveTargets);

		DragTestHelper.triggerMouseEvent(document, 'mousemove', 5, 10);
		assert.strictEqual(2, listener.callCount);
		assert.strictEqual(target2, listener.args[1][0].target);
		assert.deepEqual([target2], listener.args[1][0].allActiveTargets);
	});

	it('should add targets dynamically', function() {
		dragDrop = new DragDrop({
			sources: item,
			targets: '.target'
		});
		assert.strictEqual(2, dragDrop.targets.length);

		var newTarget = target.cloneNode(true);
		newTarget.style.top = '250px';
		dom.enterDocument(newTarget);
		assert.strictEqual(2, dragDrop.targets.length);

		dragDrop.addTarget(newTarget);
		assert.strictEqual(3, dragDrop.targets.length);

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 0, 0);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 260);
		assert.ok(dom.hasClass(newTarget, 'targetOver'));
	});

	it('should remove targets dynamically', function() {
		dragDrop = new DragDrop({
			sources: item,
			targets: '.target'
		});
		assert.strictEqual(2, dragDrop.targets.length);

		dragDrop.removeTarget(target);
		assert.strictEqual(1, dragDrop.targets.length);

		DragTestHelper.triggerMouseEvent(item, 'mousedown', 0, 0);
		DragTestHelper.triggerMouseEvent(document, 'mousemove', 40, 260);
		assert.ok(!dom.hasClass(target, 'targetOver'));
	});

	describe('Multiple Targets', function() {
		var nestedTarget;
		var intersectTarget;

		beforeEach(function() {
			nestedTarget = target.cloneNode(true);
			nestedTarget.style.left = '50px';
			nestedTarget.style.top = '50px';
			nestedTarget.style.height = '50px';
			nestedTarget.style.width = '50px';
			dom.append(target, nestedTarget);

			intersectTarget = target.cloneNode(true);
			intersectTarget.style.left = '150px';
			intersectTarget.style.top = '50px';
			dom.append(document.body, intersectTarget);
		});

		it('should indicate all active targets in the "targetEnter" event', function() {
			dragDrop = new DragDrop({
				sources: item,
				targets: '.target'
			});

			var listener = sinon.stub();
			dragDrop.on(DragDrop.Events.TARGET_ENTER, listener);

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 0, 0);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 160, 60);
			assert.strictEqual(1, listener.callCount);
			assert.strictEqual(target, listener.args[0][0].target);
			assert.deepEqual([target, intersectTarget], listener.args[0][0].allActiveTargets);
		});

		it('should consider nested target as the main active target', function() {
			dragDrop = new DragDrop({
				sources: item,
				targets: '.target'
			});

			var listener = sinon.stub();
			dragDrop.on(DragDrop.Events.TARGET_ENTER, listener);

			DragTestHelper.triggerMouseEvent(item, 'mousedown', 0, 0);
			DragTestHelper.triggerMouseEvent(document, 'mousemove', 80, 80);
			assert.strictEqual(1, listener.callCount);
			assert.strictEqual(nestedTarget, listener.args[0][0].target);
			assert.deepEqual([nestedTarget, target], listener.args[0][0].allActiveTargets);
		});
	});
});
