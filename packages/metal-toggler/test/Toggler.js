'use strict';

import dom from 'metal-dom';
import Toggler from '../src/Toggler';

describe('Toggler', function() {
	let toggler;

	afterEach(function() {
		document.body.innerHTML = '';
		toggler.dispose();
	});

	describe('Single Element Toggler', function() {
		beforeEach(function() {
			dom.enterDocument('<button class="toggler-btn"></button>');
			dom.enterDocument(
				'<div class="toggler-content toggler-collapsed"></div>'
			);
		});

		it('should not have already resolved default container value', function() {
			assert.isUndefined(Toggler.STATE.container.value);

			createToggler();

			assert.equal(toggler.container, document);
		});

		it('should expand/collapse content when header is clicked', function() {
			createToggler();

			dom.triggerEvent(toggler.header, 'click');
			assert.ok(!dom.hasClass(toggler.content, toggler.collapsedClasses));
			assert.ok(dom.hasClass(toggler.content, toggler.expandedClasses));
			assert.ok(toggler.header.getAttribute('aria-expanded') === 'true');
			assert.ok(toggler.content.getAttribute('aria-expanded') === 'true');

			dom.triggerEvent(toggler.header, 'click');
			assert.ok(dom.hasClass(toggler.content, toggler.collapsedClasses));
			assert.ok(!dom.hasClass(toggler.content, toggler.expandedClasses));
			assert.ok(toggler.header.getAttribute('aria-expanded') === 'false');
			assert.ok(toggler.content.getAttribute('aria-expanded') === 'false');
		});

		it('should expand/collapse content when ENTER key is pressed on header', function() {
			createToggler();

			dom.triggerEvent(toggler.header, 'keydown', {
				keyCode: 13,
			});
			assert.ok(!dom.hasClass(toggler.content, toggler.collapsedClasses));
			assert.ok(dom.hasClass(toggler.content, toggler.expandedClasses));

			dom.triggerEvent(toggler.header, 'keydown', {
				keyCode: 13,
			});
			assert.ok(dom.hasClass(toggler.content, toggler.collapsedClasses));
			assert.ok(!dom.hasClass(toggler.content, toggler.expandedClasses));
		});

		it('should expand/collapse content when SPACE key is pressed on header', function() {
			createToggler();

			dom.triggerEvent(toggler.header, 'keydown', {
				keyCode: 32,
			});
			assert.ok(!dom.hasClass(toggler.content, toggler.collapsedClasses));
			assert.ok(dom.hasClass(toggler.content, toggler.expandedClasses));

			dom.triggerEvent(toggler.header, 'keydown', {
				keyCode: 32,
			});
			assert.ok(dom.hasClass(toggler.content, toggler.collapsedClasses));
			assert.ok(!dom.hasClass(toggler.content, toggler.expandedClasses));
		});

		it('should not expand/collapse content when any other key is pressed on header', function() {
			createToggler();

			dom.triggerEvent(toggler.header, 'keydown', {
				keyCode: 10,
			});
			assert.ok(dom.hasClass(toggler.content, toggler.collapsedClasses));
			assert.ok(!dom.hasClass(toggler.content, toggler.expandedClasses));
		});

		it('should add css classes to header when content is expanded/collapsed', function() {
			createToggler();

			dom.triggerEvent(toggler.header, 'click');
			assert.ok(!dom.hasClass(toggler.header, toggler.headerCollapsedClasses));
			assert.ok(dom.hasClass(toggler.header, toggler.headerExpandedClasses));

			dom.triggerEvent(toggler.header, 'click');
			assert.ok(dom.hasClass(toggler.header, toggler.headerCollapsedClasses));
			assert.ok(!dom.hasClass(toggler.header, toggler.headerExpandedClasses));
		});

		it('should not throw error if no header is given', function() {
			assert.doesNotThrow(function() {
				toggler = new Toggler({
					content: dom.toElement('.toggler-content'),
				});
			});
		});

		it('should expand/collapse content by calling the public method', function() {
			createToggler();

			toggler.expand();
			assert.ok(!dom.hasClass(toggler.content, toggler.collapsedClasses));
			assert.ok(dom.hasClass(toggler.content, toggler.expandedClasses));
			assert.ok(!dom.hasClass(toggler.header, toggler.headerCollapsedClasses));
			assert.ok(dom.hasClass(toggler.header, toggler.headerExpandedClasses));

			toggler.collapse();
			assert.ok(dom.hasClass(toggler.content, toggler.collapsedClasses));
			assert.ok(!dom.hasClass(toggler.content, toggler.expandedClasses));
			assert.ok(dom.hasClass(toggler.header, toggler.headerCollapsedClasses));
			assert.ok(!dom.hasClass(toggler.header, toggler.headerExpandedClasses));
		});

		it('should fire events when the header is toggled', function() {
			createToggler();

			const listener = sinon.stub();

			toggler.on('headerToggled', listener);

			dom.triggerEvent(toggler.header, 'click');
			dom.triggerEvent(toggler.header, 'click');

			assert.equal(listener.callCount, 2);
			assert.equal(listener.getCall(0).args[1].type, 'headerToggled');
			assert.equal(listener.getCall(1).args[1].type, 'headerToggled');
		});

		it('should fire an event when the header is expanded', function() {
			createToggler();

			const listener = sinon.stub();

			toggler.on('headerExpanded', listener);

			dom.triggerEvent(toggler.header, 'click');
			dom.triggerEvent(toggler.header, 'click');

			assert.equal(listener.callCount, 1);
			assert.equal(listener.getCall(0).args[1].type, 'headerExpanded');
		});

		it('should fire an event when the header is collapsed', function() {
			createToggler();

			const listener = sinon.stub();

			toggler.on('headerCollapsed', listener);

			dom.triggerEvent(toggler.header, 'click');
			dom.triggerEvent(toggler.header, 'click');

			assert.equal(listener.callCount, 1);
			assert.equal(listener.getCall(0).args[1].type, 'headerCollapsed');
		});
	});

	describe('Delegate Toggler', function() {
		it('should expand/collapse the appropriate content when an element matching header selector is clicked', function() {
			dom.enterDocument('<button id="toggler1" class="toggler-btn"></button>');
			dom.enterDocument(
				'<div id="togglerContent1" class="toggler-content toggler-collapsed"></div>'
			);
			dom.enterDocument('<button id="toggler2" class="toggler-btn"></button>');
			dom.enterDocument(
				'<div id="togglerContent2" class="toggler-content toggler-collapsed"></div>'
			);

			toggler = new Toggler({
				content: '.toggler-content',
				header: '.toggler-btn',
			});

			let toggler1 = dom.toElement('#toggler1');
			let toggler2 = dom.toElement('#toggler2');
			let content1 = dom.toElement('#togglerContent1');
			let content2 = dom.toElement('#togglerContent2');

			dom.triggerEvent(toggler1, 'click');
			assert.ok(!dom.hasClass(content1, toggler.collapsedClasses));
			assert.ok(dom.hasClass(content1, toggler.expandedClasses));
			assert.ok(dom.hasClass(content2, toggler.collapsedClasses));
			assert.ok(!dom.hasClass(content2, toggler.expandedClasses));

			dom.triggerEvent(toggler2, 'click');
			assert.ok(!dom.hasClass(content1, toggler.collapsedClasses));
			assert.ok(dom.hasClass(content1, toggler.expandedClasses));
			assert.ok(!dom.hasClass(content2, toggler.collapsedClasses));
			assert.ok(dom.hasClass(content2, toggler.expandedClasses));
		});

		it('should expand the appropriate content when an element matching header by calling the publich method', function() {
			dom.enterDocument('<button id="toggler1" class="toggler-btn"></button>');
			dom.enterDocument(
				'<div id="togglerContent1" class="toggler-content toggler-collapsed"></div>'
			);
			dom.enterDocument('<button id="toggler2" class="toggler-btn"></button>');
			dom.enterDocument(
				'<div id="togglerContent2" class="toggler-content toggler-collapsed"></div>'
			);

			toggler = new Toggler({
				content: '.toggler-content',
				header: '.toggler-btn',
			});

			let toggler1 = dom.toElement('#toggler1');
			let toggler2 = dom.toElement('#toggler2');
			let content1 = dom.toElement('#togglerContent1');
			let content2 = dom.toElement('#togglerContent2');

			toggler.expand(toggler1);
			assert.ok(!dom.hasClass(content1, toggler.collapsedClasses));
			assert.ok(dom.hasClass(content1, toggler.expandedClasses));

			toggler.expand(toggler2);
			assert.ok(!dom.hasClass(content2, toggler.collapsedClasses));
			assert.ok(dom.hasClass(content2, toggler.expandedClasses));
		});

		it('should collapse the appropriate content when an element matching header by calling the publich method', function() {
			dom.enterDocument('<button id="toggler1" class="toggler-btn"></button>');
			dom.enterDocument(
				'<div id="togglerContent1" class="toggler-content toggler-collapsed"></div>'
			);
			dom.enterDocument('<button id="toggler2" class="toggler-btn"></button>');
			dom.enterDocument(
				'<div id="togglerContent2" class="toggler-content toggler-collapsed"></div>'
			);

			createToggler();

			let toggler1 = dom.toElement('#toggler1');
			let toggler2 = dom.toElement('#toggler2');
			let content1 = dom.toElement('#togglerContent1');
			let content2 = dom.toElement('#togglerContent2');

			toggler.collapse(toggler1);
			assert.ok(dom.hasClass(content1, toggler.collapsedClasses));
			assert.ok(!dom.hasClass(content1, toggler.expandedClasses));

			toggler.collapse(toggler2);
			assert.ok(dom.hasClass(content2, toggler.collapsedClasses));
			assert.ok(!dom.hasClass(content2, toggler.expandedClasses));
		});

		it('should toggle all elements by calling the public methods without arguments', function() {
			dom.enterDocument('<button id="toggler1" class="toggler-btn"></button>');
			dom.enterDocument(
				'<div id="togglerContent1" class="toggler-content toggler-collapsed"></div>'
			);
			dom.enterDocument('<button id="toggler2" class="toggler-btn"></button>');
			dom.enterDocument(
				'<div id="togglerContent2" class="toggler-content toggler-collapsed"></div>'
			);

			toggler = new Toggler({
				content: '.toggler-content',
				header: '.toggler-btn',
			});

			let toggler1 = dom.toElement('#toggler1');
			let toggler2 = dom.toElement('#toggler2');
			let content1 = dom.toElement('#togglerContent1');
			let content2 = dom.toElement('#togglerContent2');

			toggler.toggle();
			assert.ok(dom.hasClass(content1, toggler.expandedClasses));
			assert.ok(dom.hasClass(content2, toggler.expandedClasses));
			assert.ok(dom.hasClass(toggler1, toggler.headerExpandedClasses));
			assert.ok(dom.hasClass(toggler2, toggler.headerExpandedClasses));

			toggler.toggle();
			assert.ok(dom.hasClass(content1, toggler.collapsedClasses));
			assert.ok(dom.hasClass(content2, toggler.collapsedClasses));
			assert.ok(dom.hasClass(toggler1, toggler.headerCollapsedClasses));
			assert.ok(dom.hasClass(toggler2, toggler.headerCollapsedClasses));
		});

		it('should use the header\'s next matched sibling as its content', function() {
			dom.enterDocument('<button class="toggler-btn"></button>');
			dom.enterDocument('<div>Some other content</div>');
			dom.enterDocument(
				'<div id="togglerContent1" class="toggler-content toggler-collapsed"></div>'
			);
			dom.enterDocument(
				'<div id="togglerContent2" class="toggler-content toggler-collapsed"></div>'
			);

			createToggler();

			dom.triggerEvent(dom.toElement('.toggler-btn'), 'click');
			assert.ok(
				!dom.hasClass(
					dom.toElement('#togglerContent1'),
					toggler.collapsedClasses
				)
			);
			assert.ok(
				dom.hasClass(dom.toElement('#togglerContent1'), toggler.expandedClasses)
			);
		});

		it('should use the header\'s first matched child if no sibling matches content selector', function() {
			dom.enterDocument(
				'<div class="toggler-btn"><div class="toggler-content toggler-collapsed"></div></div>'
			);

			createToggler();

			dom.triggerEvent(dom.toElement('.toggler-btn'), 'click');
			assert.ok(
				!dom.hasClass(
					dom.toElement('.toggler-content'),
					toggler.collapsedClasses
				)
			);
			assert.ok(
				dom.hasClass(dom.toElement('.toggler-content'), toggler.expandedClasses)
			);
		});

		it('should use any matched element if no matching header sibling or child is found', function() {
			dom.enterDocument('<button class="toggler-btn"></button>');
			dom.enterDocument(
				'<div><div class="toggler-content toggler-collapsed"></div></div>'
			);

			createToggler();

			dom.triggerEvent(dom.toElement('.toggler-btn'), 'click');
			assert.ok(
				!dom.hasClass(
					dom.toElement('.toggler-content'),
					toggler.collapsedClasses
				)
			);
			assert.ok(
				dom.hasClass(dom.toElement('.toggler-content'), toggler.expandedClasses)
			);
		});

		describe('Container', function() {
			beforeEach(function() {
				dom.enterDocument('<button class="toggler-btn"></button>');
				dom.enterDocument(
					'<div class="toggler-content toggler-collapsed"></div>'
				);
				dom.enterDocument(
					'<div class="container">' +
						'<button class="toggler-btn"></button>' +
						'<div class="toggler-content toggler-collapsed"></div>' +
						'</div>'
				);
			});

			it('should only work for header elements that are inside container given as selector', function() {
				toggler = new Toggler({
					container: '.container',
					content: '.toggler-content',
					header: '.toggler-btn',
				});

				dom.triggerEvent(dom.toElement('.toggler-btn'), 'click');
				assert.ok(
					dom.hasClass(
						dom.toElement('.toggler-content'),
						toggler.collapsedClasses
					)
				);
				assert.ok(
					!dom.hasClass(
						dom.toElement('.toggler-content'),
						toggler.expandedClasses
					)
				);

				dom.triggerEvent(dom.toElement('.container .toggler-btn'), 'click');
				assert.ok(
					!dom.hasClass(
						dom.toElement('.container .toggler-content'),
						toggler.collapsedClasses
					)
				);
				assert.ok(
					dom.hasClass(
						dom.toElement('.container .toggler-content'),
						toggler.expandedClasses
					)
				);
			});

			it('should only work for header elements that are inside container given as element', function() {
				toggler = new Toggler({
					container: dom.toElement('.container'),
					content: '.toggler-content',
					header: '.toggler-btn',
				});

				dom.triggerEvent(dom.toElement('.toggler-btn'), 'click');
				assert.ok(
					dom.hasClass(
						dom.toElement('.toggler-content'),
						toggler.collapsedClasses
					)
				);
				assert.ok(
					!dom.hasClass(
						dom.toElement('.toggler-content'),
						toggler.expandedClasses
					)
				);

				dom.triggerEvent(dom.toElement('.container .toggler-btn'), 'click');
				assert.ok(
					!dom.hasClass(
						dom.toElement('.container .toggler-content'),
						toggler.collapsedClasses
					)
				);
				assert.ok(
					dom.hasClass(
						dom.toElement('.container .toggler-content'),
						toggler.expandedClasses
					)
				);
			});
		});
	});

	function createToggler() {
		toggler = new Toggler({
			content: dom.toElement('.toggler-content'),
			header: dom.toElement('.toggler-btn'),
		});
	}
});
