'use strict';

import { extractData, parse, toRegex } from '../src/pathParser';

describe('pathParser', function() {
	describe('parse', function() {
		it('should parse simple path with no params', function() {
			const parsed = parse('/my/path');
			assert.deepEqual(['/my/path'], parsed);
		});

		it('should parse path with params', function() {
			const parsed = parse('/my/path/prefix-:foo/and/:bar-suffix');
			assert.strictEqual(5, parsed.length);
			assert.strictEqual('/my/path/prefix-', parsed[0]);
			assert.strictEqual('foo', parsed[1].name);
			assert.strictEqual('[^\\/]+', parsed[1].pattern);
			assert.strictEqual('/and', parsed[2]);
			assert.strictEqual('bar', parsed[3].name);
			assert.strictEqual('[^\\/]+', parsed[3].pattern);
			assert.strictEqual('-suffix', parsed[4]);
		});

		it('should parse param with pattern', function() {
			const parsed = parse('/my/path/:foo(\\d+)');
			assert.strictEqual(2, parsed.length);
			assert.strictEqual('/my/path', parsed[0]);
			assert.strictEqual('foo', parsed[1].name);
			assert.strictEqual('\\d+', parsed[1].pattern);
		});

		it('should parse param with empty pattern', function() {
			const parsed = parse('/my/path/:foo()');
			assert.strictEqual(2, parsed.length);
			assert.strictEqual('/my/path', parsed[0]);
			assert.strictEqual('foo', parsed[1].name);
			assert.strictEqual('[^\\/]+', parsed[1].pattern);
		});

		it('should parse unnamed param patterns', function() {
			const parsed = parse('/my/path/(\\w+)/prefix-(\\d+)');
			assert.strictEqual(4, parsed.length);
			assert.strictEqual('/my/path', parsed[0]);
			assert.strictEqual('0', parsed[1].name);
			assert.strictEqual('\\w+', parsed[1].pattern);
			assert.strictEqual('/prefix-', parsed[2]);
			assert.strictEqual('1', parsed[3].name);
			assert.strictEqual('\\d+', parsed[3].pattern);
		});
	});

	describe('toRegex', function() {
		it('should return regex that will match path with and without trailing slash', function() {
			let regex = toRegex('/my/path');
			assert.ok(regex.test('/my/path'));
			assert.ok(regex.test('/my/path/'));
			assert.ok(!regex.test('/my/path/or/not'));
			assert.ok(!regex.test('/not/my/path'));

			regex = toRegex('/my/path/');
			assert.ok(regex.test('/my/path'));
			assert.ok(regex.test('/my/path/'));
			assert.ok(!regex.test('/my/path/or/not'));
			assert.ok(!regex.test('/not/my/path'));
		});

		it('should return regex that will match path with queries', function() {
			const regex = toRegex('/my/path?foo=bar');
			assert.ok(regex.test('/my/path?foo=bar'));
			assert.ok(!regex.test('/my/path?foo=foo'));
			assert.ok(!regex.test('/my/path/'));
			assert.ok(!regex.test('/my/path/'));
			assert.ok(!regex.test('not/my/path?foo=bar'));
		});

		it('should return regex that will match params', function() {
			const regex = toRegex('/my/path/prefix-:foo/and/:bar-suffix');
			assert.ok(!'/not/my/path'.match(regex));

			const match = '/my/path/prefix-10/and/20-suffix'.match(regex);
			assert.ok(match);
			assert.strictEqual('10', match[1]);
			assert.strictEqual('20', match[2]);
		});

		it('should return regex that will match params according to their own regex', function() {
			const regex = toRegex('/my/path/:foo(\\d+)');
			assert.ok(!'/my/path'.match(regex));
			assert.ok(!'/not/my/path'.match(regex));
			assert.ok(!'/my/path/nan'.match(regex));

			const match = '/my/path/42'.match(regex);
			assert.ok(match);
			assert.strictEqual('42', match[1]);
		});

		it('should return regex matching paths with optional params', function() {
			const regex = toRegex('/my/path/pre:optfoo?/and1/:required/and2/:optbar?');
			assert.ok(!'/not/my/path'.match(regex));
			assert.ok(!'/my/path'.match(regex));
			assert.ok(!'/my/path/10/and1/and2/20'.match(regex));
			assert.ok(!'/my/path/and1/and2'.match(regex));
			assert.ok(!'/my/path/and1/test/and2'.match(regex));

			let match = '/my/path/pre/and1/test/and2'.match(regex);
			assert.ok(match);
			assert.ok(!match[1]);
			assert.strictEqual('test', match[2]);
			assert.ok(!match[3]);

			match = '/my/path/pre10/and1/test/and2/20'.match(regex);
			assert.ok(match);
			assert.strictEqual('10', match[1]);
			assert.strictEqual('test', match[2]);
			assert.strictEqual('20', match[3]);
		});

		it('should return regex matching paths with params that repeat one or more times', function() {
			const regex = toRegex('/my/path/pre:foo+/and/:bar+');
			assert.ok(!'/not/my/path'.match(regex));
			assert.ok(!'/my/path'.match(regex));
			assert.ok(!'/my/path/pre/and'.match(regex));
			assert.ok(!'/my/path/prefoo/and'.match(regex));

			let match = '/my/path/prefoo/and/bar'.match(regex);
			assert.ok(match);
			assert.strictEqual('foo', match[1]);
			assert.strictEqual('bar', match[2]);

			match = '/my/path/prefoo/foo/foo/and/bar/bar'.match(regex);
			assert.ok(match);
			assert.strictEqual('foo/foo/foo', match[1]);
			assert.strictEqual('bar/bar', match[2]);
		});

		it('should return regex matching paths with params that repeat zeno or more times', function() {
			const regex = toRegex('/my/path/pre:foo*/and/:bar*');
			assert.ok(!'/not/my/path'.match(regex));
			assert.ok(!'/my/path'.match(regex));
			assert.ok(!'/my/path/pre'.match(regex));

			let match = '/my/path/pre/and'.match(regex);
			assert.ok(match);
			assert.ok(!match[1]);
			assert.ok(!match[2]);

			match = '/my/path/prefoo/foo/foo/and/bar/bar'.match(regex);
			assert.ok(match);
			assert.strictEqual('foo/foo/foo', match[1]);
			assert.strictEqual('bar/bar', match[2]);
		});
	});

	describe('extractData', function() {
		it('should return null if path doesn\'t match given format', function() {
			assert.strictEqual(null, extractData('/my/path', '/other/path'));
		});

		it('should return empty object if original route has no params', function() {
			assert.deepEqual({}, extractData('/my/path', '/my/path'));
		});

		it('should return param data found extracted from real path', function() {
			const data = extractData('/my/path/:foo/:bar', '/my/path/test/test2');
			const expectedData = {
				foo: 'test',
				bar: 'test2'
			};
			assert.deepEqual(expectedData, data);
		});

		it('should return unnamed param data found extracted from real path', function() {
			const data = extractData('/my/path/prefix-(\\d+)/(\\w+)', '/my/path/prefix-10/test');
			const expectedData = {
				0: '10',
				1: 'test'
			};
			assert.deepEqual(expectedData, data);
		});

		it('should return object without optional param if it\'s not given', function() {
			let data = extractData('/my/path/:foo?', '/my/path');
			assert.deepEqual({}, data);
		});

		it('should return repeatable param values as arrays', function() {
			const data = extractData('/my/path/:foo*', '/my/path/test/test2/test3');
			const expectedData = {
				foo: ['test', 'test2', 'test3']
			};
			assert.deepEqual(expectedData, data);
		});

		it('should also extract data when given parsed tokens instead of the route string', function() {
			const tokens = parse('/my/path/:foo/(\\d+)');
			const data = extractData(tokens, '/my/path/test/10');
			const expectedData = {
				foo: 'test',
				0: '10'
			};
			assert.deepEqual(expectedData, data);
		});
	});
});
