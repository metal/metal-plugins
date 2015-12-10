'use strict';

import dom from 'bower:metal/src/dom/dom';
import Toggler from '../src/Toggler';

describe('Toggler', function() {
	var toggler;

	beforeEach(function() {
		dom.enterDocument('<button class="toggler-btn"></button>');
		dom.enterDocument('<div class="toggler-content"></div>');
	});

	afterEach(function() {
		document.body.innerHTML = '';
		toggler.dispose();
	});

	it('should begin with content collapsed by default', function() {
		toggler = new Toggler({
			content: '.toggler-content',
			header: '.toggler-btn'
		});
		assert.ok(dom.hasClass(toggler.content, Toggler.CSS_COLLAPSED));
		assert.ok(!dom.hasClass(toggler.content, Toggler.CSS_EXPANDED));
		assert.ok(!toggler.expanded);
	});

	it('should expand/collapse content when header is clicked', function() {
		toggler = new Toggler({
			content: '.toggler-content',
			header: '.toggler-btn'
		});

		dom.triggerEvent(toggler.header, 'click');
		assert.ok(!dom.hasClass(toggler.content, Toggler.CSS_COLLAPSED));
		assert.ok(dom.hasClass(toggler.content, Toggler.CSS_EXPANDED));
		assert.ok(toggler.expanded);

		dom.triggerEvent(toggler.header, 'click');
		assert.ok(dom.hasClass(toggler.content, Toggler.CSS_COLLAPSED));
		assert.ok(!dom.hasClass(toggler.content, Toggler.CSS_EXPANDED));
		assert.ok(!toggler.expanded);
	});

	it('should expand/collapse content when ENTER key is pressed on header', function() {
		toggler = new Toggler({
			content: '.toggler-content',
			header: '.toggler-btn'
		});

		dom.triggerEvent(toggler.header, 'keydown', {
			keyCode: 13
		});
		assert.ok(!dom.hasClass(toggler.content, Toggler.CSS_COLLAPSED));
		assert.ok(dom.hasClass(toggler.content, Toggler.CSS_EXPANDED));
		assert.ok(toggler.expanded);

		dom.triggerEvent(toggler.header, 'keydown', {
			keyCode: 13
		});
		assert.ok(dom.hasClass(toggler.content, Toggler.CSS_COLLAPSED));
		assert.ok(!dom.hasClass(toggler.content, Toggler.CSS_EXPANDED));
		assert.ok(!toggler.expanded);
	});

	it('should expand/collapse content when SPACE key is pressed on header', function() {
		toggler = new Toggler({
			content: '.toggler-content',
			header: '.toggler-btn'
		});

		dom.triggerEvent(toggler.header, 'keydown', {
			keyCode: 32
		});
		assert.ok(!dom.hasClass(toggler.content, Toggler.CSS_COLLAPSED));
		assert.ok(dom.hasClass(toggler.content, Toggler.CSS_EXPANDED));
		assert.ok(toggler.expanded);

		dom.triggerEvent(toggler.header, 'keydown', {
			keyCode: 32
		});
		assert.ok(dom.hasClass(toggler.content, Toggler.CSS_COLLAPSED));
		assert.ok(!dom.hasClass(toggler.content, Toggler.CSS_EXPANDED));
		assert.ok(!toggler.expanded);
	});

	it('should not expand/collapse content when any other key is pressed on header', function() {
		toggler = new Toggler({
			content: '.toggler-content',
			header: '.toggler-btn'
		});

		dom.triggerEvent(toggler.header, 'keydown', {
			keyCode: 10
		});
		assert.ok(dom.hasClass(toggler.content, Toggler.CSS_COLLAPSED));
		assert.ok(!dom.hasClass(toggler.content, Toggler.CSS_EXPANDED));
		assert.ok(!toggler.expanded);
	});

	it('should expand/collapse content when the "expanded" attribute is set', function() {
		toggler = new Toggler({
			content: '.toggler-content'
		});

		toggler.expanded = true;
		assert.ok(!dom.hasClass(toggler.content, Toggler.CSS_COLLAPSED));
		assert.ok(dom.hasClass(toggler.content, Toggler.CSS_EXPANDED));

		toggler.expanded = false;
		assert.ok(dom.hasClass(toggler.content, Toggler.CSS_COLLAPSED));
		assert.ok(!dom.hasClass(toggler.content, Toggler.CSS_EXPANDED));
	});

	it('should also allow passing elements directly to "content" and "header"', function() {
		toggler = new Toggler({
			content: dom.toElement('.toggler-content'),
			header: dom.toElement('.toggler-btn')
		});

		dom.triggerEvent(toggler.header, 'click');
		assert.ok(!dom.hasClass(toggler.content, Toggler.CSS_COLLAPSED));
		assert.ok(dom.hasClass(toggler.content, Toggler.CSS_EXPANDED));
		assert.ok(toggler.expanded);

		dom.triggerEvent(toggler.header, 'click');
		assert.ok(dom.hasClass(toggler.content, Toggler.CSS_COLLAPSED));
		assert.ok(!dom.hasClass(toggler.content, Toggler.CSS_EXPANDED));
		assert.ok(!toggler.expanded);
	});
});
