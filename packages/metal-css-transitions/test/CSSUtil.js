'use strict';

import CSSUtil from '../src/CSSUtil';

describe('CSSUtil', function() {
	it('should add a class', function() {
		const node = document.createElement('div');

		assert.strictEqual('', node.className);
		CSSUtil.addClass(node, 'test');
		assert.strictEqual('test', node.className);
	});

	it('should add a class when one is already present', function() {
		const node = document.createElement('div');

		node.className = 'test';

		assert.strictEqual('test', node.className);
		CSSUtil.addClass(node, 'test2');
		assert.strictEqual('test test2', node.className);
	});

	it('should remove a class', function() {
		const node = document.createElement('div');

		node.className = 'test';

		assert.strictEqual('test', node.className);
		CSSUtil.removeClass(node, 'test');
		assert.strictEqual('', node.className);
	});
});
