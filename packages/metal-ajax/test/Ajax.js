'use strict';

import Ajax from '../src/Ajax';
import MultiMap from 'metal-multimap/src/MultiMap';

describe('Ajax', function() {

	describe('Utils', function() {

		it('should parse urls', function() {
			assert.deepEqual(['localhost:8080', '/path/a', ''], Ajax.parseUrl('http://localhost:8080/path/a'));
			assert.deepEqual(['localhost:8080', '/path/a', ''], Ajax.parseUrl('//localhost:8080/path/a'));
			assert.deepEqual(['localhost:8080', '/path/a', ''], Ajax.parseUrl('localhost:8080/path/a'));
			assert.deepEqual(['', '/path/a', ''], Ajax.parseUrl('/path/a'));
			assert.deepEqual(['', '/path/a', '?foo=1'], Ajax.parseUrl('/path/a?foo=1'));
			assert.deepEqual(['localhost:8080', '/', ''], Ajax.parseUrl('localhost:8080'));
			assert.deepEqual(['localhost:8080', '/', ''], Ajax.parseUrl('localhost:8080/'));
		});

		it('should join paths', function() {
			assert.strictEqual('foo', Ajax.joinPaths('foo', ''));
			assert.strictEqual('/foo', Ajax.joinPaths('', 'foo'));
			assert.strictEqual('foo', Ajax.joinPaths('foo/', ''));
			assert.strictEqual('/foo', Ajax.joinPaths('', 'foo/'));
			assert.strictEqual('foo/bar', Ajax.joinPaths('foo/', '/bar'));
			assert.strictEqual('foo/bar', Ajax.joinPaths('foo/', 'bar'));
			assert.strictEqual('foo/bar', Ajax.joinPaths('foo', 'bar'));
			assert.strictEqual('foo/bar', Ajax.joinPaths('foo', '/bar'));
			assert.strictEqual('foo/bar/bazz', Ajax.joinPaths('foo', '/bar', 'bazz'));
		});

		it('should join paths with full urls', function() {
			assert.strictEqual('http://localhost:123', Ajax.joinPaths('http://localhost:123', ''));
		});

		it('should parse response headers', function() {
			var headers = 'Name\u003a\u0020Value\u000d\u000aName\u003a\u0020Value';
			assert.deepEqual([{
				name: 'Name',
				value: 'Value'
			}, {
				name: 'Name',
				value: 'Value'
			}], Ajax.parseResponseHeaders(headers));
		});

		it('should return empty array when parsing empty response headers', function() {
			var headers = '';
			assert.deepEqual([], Ajax.parseResponseHeaders(headers));
		});

		it('should add parameters to querystring', function() {
			var params = new MultiMap();
			params.add('a', '1');
			params.add('b', '2');
			params.add('b', '3');
			assert.strictEqual('/path?pre=1&a=1&b=2&b=3', Ajax.addParametersToUrlQueryString('/path?pre=1', params));
		});

		it('should set parameters to querystring', function() {
			var params = new MultiMap();
			params.add('a', '1');
			params.add('b', '2');
			params.add('b', '3');
			assert.strictEqual('/path?a=1&b=2&b=3', Ajax.addParametersToUrlQueryString('/path', params));
		});

	});

	describe('Request', function() {

		beforeEach(function() {
			this.xhr = sinon.useFakeXMLHttpRequest();

			var requests = this.requests = [];

			this.xhr.onCreate = function(xhr) {
				requests.push(xhr);
			};
		});

		afterEach(function() {
			this.xhr.restore();
		});

		it('should send request to an url', function(done) {
			Ajax.request('/url').then(function(xhrResponse) {
				assert.strictEqual('/url', xhrResponse.url);
				done();
			});
			this.requests[0].respond(200);
		});

		it('should cancel send request to an url', function(done) {
			var self = this;
			Ajax.request('/url')
				.then(function() {
					assert.fail();
				})
				.catch(function() {
					assert.ok(self.requests[0].aborted);
					done();
				})
				.cancel();
		});

		it('should send request with different http method', function(done) {
			Ajax.request('/url', 'POST')
				.then(function(xhrResponse) {
					assert.strictEqual('POST', xhrResponse.method);
					done();
				});
			this.requests[0].respond(200);
		});

		it('should send request with body', function(done) {
			Ajax.request('/url', 'post', 'requestBody')
				.then(function(xhrResponse) {
					assert.strictEqual('requestBody', xhrResponse.requestBody);
					assert.strictEqual('responseBody', xhrResponse.response);
					done();
				});
			this.requests[0].respond(200, null, 'responseBody');
		});

		it('should send request with header', function(done) {
			var headers = new MultiMap();
			headers.add('content-type', 'application/json');
			Ajax.request('/url', 'get', null, headers)
				.then(function(xhrResponse) {
					assert.deepEqual({
						'content-type': 'application/json'
					}, xhrResponse.requestHeaders);
					done();
				});
			this.requests[0].respond(200);
		});

		it('should send request with multiple headers with same name', function(done) {
			var headers = new MultiMap();
			headers.add('content-type', 'application/json');
			headers.add('content-type', 'text/html');
			Ajax.request('/url', 'get', null, headers)
				.then(function(xhrResponse) {
					assert.deepEqual({
						'content-type': 'application/json, text/html'
					}, xhrResponse.requestHeaders);
					done();
				});
			this.requests[0].respond(200);
		});

		it('should response with headers', function(done) {
			Ajax.request('/url')
				.then(function(xhrResponse) {
					assert.deepEqual({
						'content-type': 'application/json'
					}, xhrResponse.responseHeaders);
					done();
				});
			this.requests[0].respond(200, {
				'content-type': 'application/json'
			});
		});

		it('should response success with any status code', function(done) {
			Ajax.request('/url').then(function(xhrResponse) {
				assert.strictEqual(500, xhrResponse.status);
				done();
			});
			this.requests[0].respond(500);
		});

		it('should parse request query string', function(done) {
			var params = new MultiMap();
			params.add('query', 1);
			params.add('query', ' ');
			Ajax.request('/url?foo=1', 'get', null, null, params, null, false)
				.then(function(xhrResponse) {
					assert.strictEqual('/url?foo=1&query=1&query=%20', xhrResponse.url);
					done();
				});
			this.requests[0].respond(200);
		});

		it('should parse request query string without params', function(done) {
			Ajax.request('/url?foo=1', 'get', null, null, null, null, false)
				.then(function(xhrResponse) {
					assert.strictEqual('/url?foo=1', xhrResponse.url);
					done();
				});
			this.requests[0].respond(200);
		});

		it('should cancel request if given timeout is reached', function(done) {
			Ajax.request('/url?foo=1', 'get', null, null, null, 100, false)
				.catch(function() {
					done();
				});
		});

		it('should fail on request error', function(done) {
			Ajax.request('/url')
				.catch(function(reason) {
					assert.ok(reason instanceof Error);
					done();
				});
			this.requests[0].abort();
		});

	});

});
