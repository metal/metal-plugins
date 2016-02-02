'use strict';

import parse from '../src/parse';

describe('parse', function() {
	it('should parse url into an object', function() {
		var uri = parse('http://user:pass@hostname:8080/ignore?a=1#hash');
		assert.strictEqual('#hash', uri.hash);
		assert.strictEqual('hostname', uri.hostname);
		assert.strictEqual('pass', uri.password);
		assert.strictEqual('/ignore', uri.pathname);
		assert.strictEqual('8080', uri.port);
		assert.strictEqual('http:', uri.protocol);
		assert.strictEqual('?a=1', uri.search);
		assert.strictEqual('user', uri.username);
	});
});
