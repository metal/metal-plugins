import {currentElement, patch, text} from '../src/core.js';

import {
	attr,
	elementClose,
	elementOpen,
	elementOpenEnd,
	elementOpenStart,
	elementVoid,
	renderToString,
} from '../src/virtual_elements.js';

describe('element creation', () => {
	const findAttribute = (node, attr, check = true) => {
		const data = new RegExp(attr + '="(\\w+)"');
		const match = node.innerHTML.match(data);

		if (check) {
			expect(match !== null).toBeTruthy();
			expect(Array.isArray(match)).toBeTruthy();
			expect(match.length).toEqual(2);
		}

		return match;
	};

	it('when creating a single node with formatted text', () => {
		const output = renderToString(() => {
			elementOpen('div');
			text('Hello wor', val => val + 'l', val => val + 'd');
			elementClose('div');
		});
		expect(output).toBe('<div>Hello world</div>');
	});

	it('when creating a single node with text', () => {
		const output = renderToString(() => {
			elementOpen('div');
			text('Hello world');
			elementClose('div');
		});
		expect(output).toBe('<div>Hello world</div>');
	});

	it('when creating a single node with a child node with text', () => {
		const output = renderToString(() => {
			elementOpen('div');
			elementOpen('span');
			text('Hello world 2');
			elementClose('span');
			elementClose('div');
		});
		expect(output).toBe('<div><span>Hello world 2</span></div>');
	});

	it('when creating a single node with multiple child nodes with text', () => {
		const output = renderToString(() => {
			elementOpen('div');
			elementOpen('p');
			text('First child');
			elementClose('p');
			elementOpen('span');
			text('Second child');
			elementClose('span');
			elementClose('div');
		});
		expect(output).toBe(
			'<div><p>First child</p><span>Second child</span></div>'
		);
	});

	it('when creating a single node with attributes', () => {
		const output = renderToString(() => {
			elementOpen('div', null, ['id', 'test-div']);
			text('Test text');
			elementClose('div');
		});
		expect(output).toBe('<div id="test-div">Test text</div>');
	});

	it('when creating a single node with multiple static attributes', () => {
		const attrs = [
			'id',
			'test-id',
			'name',
			'test-name',
			'data-a',
			'test-data-a',
			'data-b',
			'test-data-b',
		];

		const expected = [
			'<div id="test-id" name="test-name"',
			'data-a="test-data-a"',
			'data-b="test-data-b">Some text</div>',
		].join(' ');

		const output = renderToString(() => {
			elementOpen('div', null, attrs);
			text('Some text');
			elementClose('div');
		});
		expect(output).toEqual(expected);
	});

	it('when creating a single node with multiple attributes', () => {
		const attrs = [
			'id',
			'test-id',
			'name',
			'test-name',
			'data-a',
			'test-data-a',
			'data-b',
			'test-data-b',
		];

		const expected = [
			'<div id="test-id" name="test-name"',
			'data-a="test-data-a"',
			'data-b="test-data-b">Some text</div>',
		].join(' ');

		const output = renderToString(() => {
			elementOpen('div', null, null, ...attrs);
			text('Some text');
			elementClose('div');
		});
		expect(output).toEqual(expected);
	});

	it('when creating a single node with several child nodes with attributes and text', () => {
		const output = renderToString(() => {
			elementOpen('div');
			elementOpen('span', null, ['name', 'span-name', 'id', 'span-id']);
			text('Foo');
			elementClose('span');
			elementOpen('button', null, [
				'name',
				'button-name',
				'id',
				'button-id',
			]);
			text('Bar');
			elementClose('button');
			elementClose('div');
		});

		const expected = [
			'<div>',
			'<span name="span-name" id="span-id">Foo</span>',
			'<button name="button-name" id="button-id">Bar</button>',
			'</div>',
		].join('');

		expect(output).toEqual(expected);
	});

	it('when creating a void node', () => {
		const output = renderToString(() => {
			elementVoid('input', null, ['type', 'text']);
		});

		expect(output).toBe('<input type="text"></input>');
	});

	it('when creating a void node with various attributes', () => {
		const output = renderToString(() => {
			elementVoid('div', null, [
				'id',
				'test-id',
				'name',
				'test-name',
				'data-test',
				'test',
			]);
		});
		expect(output).toBe(
			'<div id="test-id" name="test-name" data-test="test"></div>'
		);
	});

	it('when patching a node', () => {
		const output = renderToString(() => {
			elementOpen('main', null, [
				'id',
				'main-element',
				'data-foo',
				'bar',
			]);
			elementOpen('section');
			elementClose('section');
			elementClose('main');
		});

		let expected =
			'<main id="main-element" data-foo="bar"><section></section></main>';

		expect(output).toEqual(expected);

		/* eslint-disable */
		function createList(n = 1) {
			elementOpen('ul', null, ['id', 'test-ul']);
			for (let i = 0; i < n; i++) {
				elementOpen('li', null, ['id', `test-li-${i}`]);
				text(`List item ${i}`);
				elementClose('li');
			}
			elementClose('ul');
		}

		const node = {innerHTML: ''};

		patch(node, () => {
			return createList(10);
		});

		expected = [
			'<ul id="test-ul">',
			'<li id="test-li-0">List item 0</li>',
			'<li id="test-li-1">List item 1</li>',
			'<li id="test-li-2">List item 2</li>',
			'<li id="test-li-3">List item 3</li>',
			'<li id="test-li-4">List item 4</li>',
			'<li id="test-li-5">List item 5</li>',
			'<li id="test-li-6">List item 6</li>',
			'<li id="test-li-7">List item 7</li>',
			'<li id="test-li-8">List item 8</li>',
			'<li id="test-li-9">List item 9</li>',
			'</ul>',
		].join('');

		expect(node.innerHTML).toEqual(expected);

		patch(node, () => {
			createList(5);
		});

		expected = [
			'<ul id="test-ul">',
			'<li id="test-li-0">List item 0</li>',
			'<li id="test-li-1">List item 1</li>',
			'<li id="test-li-2">List item 2</li>',
			'<li id="test-li-3">List item 3</li>',
			'<li id="test-li-4">List item 4</li>',
			'</ul>',
		].join('');

		expect(node.innerHTML).toEqual(expected);
	});

	it('should flush the output', () => {
		const output1 = renderToString(() => {
			elementOpen('main', null, [
				'id',
				'main-element',
				'data-foo',
				'bar',
			]);
			elementOpen('section');
			elementClose('section');
			elementClose('main');
		});

		expect(output1).toBe(
			'<main id="main-element" data-foo="bar"><section></section></main>'
		);

		const output2 = renderToString(() => {});

		expect(output2).toBe('');
	});

	it('should allow creating complex nodes', () => {
		const output = renderToString(() => {
			elementOpen('main', null, ['id', 'main-el']);
			elementOpen('div');
			elementOpen('span');
			text('hello');
			elementOpen('p');
			elementVoid('a', null, ['href', 'http://liferay.com']);
			elementClose('p');
			elementClose('span');
			elementVoid('a', null, ['href', 'http://www.wedeploy.com']);
			elementClose('div');
			elementClose('main');
		});

		const expected = [
			'<main id="main-el">',
			'<div><span>hello<p><a href="http://liferay.com">',
			'</a></p></span><a href="http://www.wedeploy.com">',
			'</a></div></main>',
		].join('');

		expect(output).toEqual(expected);
	});

	describe('with patch', () => {
		let el = {innerHTML: ''};

		beforeEach(() => {
			patch(el, () => {
				elementVoid(
					'div',
					'key',
					[
						'id',
						'someId',
						'class',
						'someClass',
						'data-custom',
						'custom',
					],
					'data-foo',
					'Hello',
					'data-bar',
					'World'
				);
			});
		});

		it('should render with the specificed tag', () => {
			const expected = [
				'<div id="someId" ',
				'class="someClass" data-custom="custom" ',
				'data-foo="Hello" data-bar="World"></div>',
			].join('');

			expect(el.innerHTML).toEqual(expected);
		});

		it('should render with static attributes', () => {
			const matchId = findAttribute(el, 'id');
			expect(matchId[1]).toBe('someId');

			const matchClass = findAttribute(el, 'class');
			expect(matchClass[1]).toBe('someClass');

			const matchData = findAttribute(el, 'data-custom');
			expect(matchData[1]).toBe('custom');
		});

		it('should render with dynamic attributes', () => {
			let matchData = findAttribute(el, 'data-foo');
			expect(matchData[1]).toBe('Hello');

			matchData = findAttribute(el, 'data-bar');
			expect(matchData[1]).toBe('World');
		});

		it('should allow creation without static attributes', () => {
			patch(el, () => {
				elementVoid('div', null, null, 'id', 'test');
			});
			expect(el.innerHTML).toBe('<div id="test"></div>');
		});

		it('should patch inside renderToString flush buffer', () => {
			const output = renderToString(() => {
				patch(el, () => elementVoid('div'));
				expect(el.innerHTML).toBe('<div></div>');
			});
			expect(output).toBe('');
		});

		it('should capture currentElement inside patch', () => {
			let current = {};
			patch(current, () => elementVoid('div'));
			expect(current).toBe(currentElement());
		});
	});

	describe('with conditional attributes', () => {
		function render(obj) {
			elementOpenStart('div');
			if (obj.key) {
				attr('data-expanded', obj.key);
			}
			elementOpenEnd();
			elementClose('div');
		}

		it('should be present when specified', () => {
			const node = {innerHTML: ''};

			patch(node, () => render({key: 'hello'}));

			const matchData = findAttribute(node, 'data-expanded');
			expect(matchData[1]).toBe('hello');
		});

		it('should not be present when not specified', () => {
			const node = {innerHTML: ''};

			patch(node, () => render({key: false}));

			const matchData = findAttribute(node, 'data-expanded', false);
			expect(matchData === null).toBeTruthy();
			expect(node.innerHTML).toBe('<div></div>');
		});

		it('should update output when changed', () => {
			const node = {innerHTML: ''};

			patch(node, () => render({key: 'foo'}));
			patch(node, () => render({key: 'bar'}));

			const matchData = findAttribute(node, 'data-expanded');
			expect(matchData[1]).toBe('bar');
		});
	});

	describe('with XSS vectors', () => {
		it('should escape attributes', () => {
			const contentXSS = "<img src=x onerror=alert('contentxss')>";
			const output = renderToString(() => {
				elementOpen('div');
				elementOpen('span');
				text(contentXSS);
				elementClose('span');
				elementClose('div');
			});

			expect(output).toBe(
				"<div><span>&lt;img src=x onerror=alert('contentxss')></span></div>"
			);
		});

		it('should escape text nodes', () => {
			const attributeXSS = "\"><img src=x onerror=alert('attributexss')>";
			const output = renderToString(() => {
				elementOpen('div', null, ['id', attributeXSS]);
				text('text');
				elementClose('div');
			});

			expect(output).toBe(
				'<div id="&quot;><img src=x onerror=alert(\'attributexss\')>">text</div>'
			);
		});
	});
});
