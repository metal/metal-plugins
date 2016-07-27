'use strict';

import { parse } from '../src/pathParser';

describe('pathParser', function() {
	describe('parse', function() {
		it('should parse simple path with no params', function() {
			var parsed = parse('/my/path');
			assert.deepEqual(['/my/path'], parsed);
		});

		it('should parse path with params', function() {
			var parsed = parse('/my/path/prefix-:foo/and/:bar-suffix');
			assert.strictEqual(5, parsed.length);
			assert.strictEqual('/my/path/prefix-', parsed[0]);
			assert.strictEqual('foo', parsed[1].name);
			assert.ok(!parsed[1].pattern);
			assert.strictEqual('/and/', parsed[2]);
			assert.strictEqual('bar', parsed[3].name);
			assert.ok(!parsed[3].pattern);
			assert.strictEqual('-suffix', parsed[4]);
		});

		it('should parse param with pattern', function() {
			var parsed = parse('/my/path/:foo(\\d+)');
			assert.strictEqual(2, parsed.length);
			assert.strictEqual('/my/path/', parsed[0]);
			assert.strictEqual('foo', parsed[1].name);
			assert.strictEqual('\\d+', parsed[1].pattern);
		});

		it('should parse param with empty pattern', function() {
			var parsed = parse('/my/path/:foo()');
			assert.strictEqual(2, parsed.length);
			assert.strictEqual('/my/path/', parsed[0]);
			assert.strictEqual('foo', parsed[1].name);
			assert.strictEqual('', parsed[1].pattern);
		});

		it('should parse unnamed param patterns', function() {
			var parsed = parse('/my/path/(\\w+)/prefix-(\\d+)');
			assert.strictEqual(4, parsed.length);
			assert.strictEqual('/my/path/', parsed[0]);
			assert.strictEqual('0', parsed[1].name);
			assert.strictEqual('\\w+', parsed[1].pattern);
			assert.strictEqual('/prefix-', parsed[2]);
			assert.strictEqual('1', parsed[3].name);
			assert.strictEqual('\\d+', parsed[3].pattern);
		});
	});
});
