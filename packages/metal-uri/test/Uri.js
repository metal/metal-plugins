'use strict';

import Uri from '../src/Uri';
import {MultiMap} from 'metal-structs';

describe('Uri', function() {
	it('should support empty uri', function() {
		const uri = new Uri();
		assert.strictEqual('/', uri.getPathname());
		assert.strictEqual('/', uri.toString());
	});

	it('should get uri hostname', function() {
		const uri = new Uri('http://hostname:8080');
		assert.strictEqual('hostname', uri.getHostname());
	});

	it('should get uri host', function() {
		const uri = new Uri('http://hostname:8080');
		assert.strictEqual('hostname:8080', uri.getHost());
	});

	it('should get uri origin', function() {
		const uri = new Uri('http://hostname:8080/ignore');
		assert.strictEqual('http://hostname:8080', uri.getOrigin());
	});

	it('should get uri protocol', function() {
		let uri = new Uri('http://hostname:8080');
		assert.strictEqual('http:', uri.getProtocol());

		uri = new Uri('javascript:hostname:8080'); // jshint ignore:line
		assert.strictEqual('javascript:', uri.getProtocol()); // jshint ignore:line
	});

	it('should hostname be empty for empty uri', function() {
		const uri = new Uri();
		assert.strictEqual('', uri.getHostname());
	});

	it('should host be empty for empty uri', function() {
		const uri = new Uri();
		assert.strictEqual('', uri.getHost());
	});

	it('should origin be empty for empty uri', function() {
		const uri = new Uri();
		assert.strictEqual('', uri.getOrigin());
	});

	it('should support set port on uri', function() {
		const uri = new Uri('hostname:8080');
		assert.strictEqual('8080', uri.getPort());
		uri.setPort('81');
		assert.strictEqual('81', uri.getPort());
	});

	it('should support set protocol on uri', function() {
		const uri = new Uri('http://hostname');
		assert.strictEqual('http:', uri.getProtocol());
		uri.setProtocol('https');
		assert.strictEqual('https:', uri.getProtocol());
		uri.setProtocol('https:');
		assert.strictEqual('https:', uri.getProtocol());
	});

	it('should support only hostname', function() {
		const uri = new Uri('hostname');
		assert.strictEqual('hostname', uri.getHostname());
		assert.strictEqual('http://hostname/', uri.toString());
	});

	it('should support only hostname from setter', function() {
		const uri = new Uri();
		uri.setHostname('hostname');
		assert.strictEqual('hostname', uri.getHostname());
		assert.strictEqual('http://hostname/', uri.toString());
	});

	it('should support only pathname', function() {
		const uri = new Uri('/pathname');
		assert.strictEqual('/pathname', uri.getPathname());
		assert.strictEqual('/pathname', uri.toString());
	});

	it('should support only pathname from setter', function() {
		const uri = new Uri();
		uri.setPathname('/pathname');
		assert.strictEqual('/pathname', uri.getPathname());
		assert.strictEqual('/pathname', uri.toString());
	});

	it('should support only hash', function() {
		const uri = new Uri('#hash');
		assert.strictEqual('#hash', uri.getHash());
		assert.strictEqual('/#hash', uri.toString());
	});

	it('should support only hash from setter', function() {
		const uri = new Uri();
		uri.setHash('#hash');
		assert.strictEqual('#hash', uri.getHash());
		assert.strictEqual('/#hash', uri.toString());
	});

	it('should support only search', function() {
		assert.strictEqual('/?&=&=&', new Uri('?&=&=&').toString());
		assert.strictEqual('/?a=1', new Uri('?a=1').toString());
		assert.strictEqual('/?a=1', new Uri('?a=1').toString());
		assert.strictEqual('/?foo', new Uri('?foo').toString());
		assert.strictEqual('/?foo=', new Uri('?foo=').toString());
		assert.strictEqual('/?foo=bar', new Uri('?foo=bar').toString());
		assert.strictEqual('?&=&=&', new Uri('?&=&=&').getSearch());
		assert.strictEqual('?a=1', new Uri('?a=1').getSearch());
		assert.strictEqual('?a=1', new Uri('?a=1').getSearch());
		assert.strictEqual('?foo', new Uri('?foo').getSearch());
		assert.strictEqual('?foo=', new Uri('?foo=').getSearch());
		assert.strictEqual('?foo=bar', new Uri('?foo=bar').getSearch());
	});

	it('should support pathname with search', function() {
		const uri = new Uri('/pathname?a=1');
		assert.strictEqual('?a=1', uri.getSearch());
		assert.strictEqual('/pathname', uri.getPathname());
		assert.strictEqual('/pathname?a=1', uri.toString());
	});

	it('should support pathname with search and hash', function() {
		const uri = new Uri('/pathname?a=1#hash');
		assert.strictEqual('#hash', uri.getHash());
		assert.strictEqual('?a=1', uri.getSearch());
		assert.strictEqual('/pathname', uri.getPathname());
		assert.strictEqual('/pathname?a=1#hash', uri.toString());
	});

	it('should initialize parameters from search part of uri', function() {
		const uri = new Uri('http://hostname?a=1&b=2');
		assert.strictEqual('1', uri.getParameterValue('a'));
		assert.strictEqual('2', uri.getParameterValue('b'));
	});

	it('should set parameter value in uri', function() {
		const uri = new Uri();
		uri.setParameterValue('a', '1');
		uri.setParameterValue('a', '2');
		assert.strictEqual('2', uri.getParameterValue('a'));
		assert.deepEqual(['2'], uri.getParameterValues('a'));
	});

	it('should set parameter values in uri', function() {
		const uri = new Uri();
		uri.setParameterValues('a', ['1', '2']);
		assert.strictEqual('1', uri.getParameterValue('a'));
		assert.deepEqual(['1', '2'], uri.getParameterValues('a'));
	});

	it('should add parameter value in uri', function() {
		const uri = new Uri();
		uri.addParameterValue('a', '1');
		uri.addParameterValue('a', '2');
		assert.strictEqual('1', uri.getParameterValue('a'));
		assert.deepEqual(['1', '2'], uri.getParameterValues('a'));
	});

	it('should add parameter values in uri', function() {
		const uri = new Uri();
		uri.addParameterValues('a', ['1', '2']);
		assert.strictEqual('1', uri.getParameterValue('a'));
		assert.deepEqual(['1', '2'], uri.getParameterValues('a'));
	});

	it('should remove parameter in uri', function() {
		const uri = new Uri();
		uri.setParameterValue('a', '1');
		uri.removeParameter('a');
		assert.strictEqual(undefined, uri.getParameterValue('a'));
	});

	it('should add parameter value in uri be case insensitive', function() {
		const uri = new Uri();
		uri.addParameterValue('a', '1');
		uri.addParameterValue('A', '2');
		uri.addParameterValue('a', '3');
		assert.strictEqual('1', uri.getParameterValue('a'));
		assert.strictEqual('1', uri.getParameterValue('A'));
		assert.deepEqual(['1', '2', '3'], uri.getParameterValues('a'));
		assert.deepEqual(['1', '2', '3'], uri.getParameterValues('A'));
		assert.strictEqual('/?a=1&a=2&a=3', uri.toString());
	});

	it('should encode parameter value in uri', function() {
		const uri = new Uri();
		uri.setParameterValue('a', 'one space');
		assert.strictEqual('one space', uri.getParameterValue('a'));
		assert.strictEqual('/?a=one%20space', uri.toString());
	});

	it('should parameter value preserve encoding', function() {
		const uri = new Uri();
		uri.setParameterValue('a', 'one%20space');
		assert.strictEqual('one%20space', uri.getParameterValue('a'));
		assert.strictEqual('/?a=one%2520space', uri.toString());
	});

	it('should parameter value in url preserve encoding', function() {
		const uri = new Uri('?a=one%20space');
		assert.strictEqual('one space', uri.getParameterValue('a'));
		assert.strictEqual('/?a=one%20space', uri.toString());
	});

	it('should handle plus char as space char before decoding', function() {
		assert.strictEqual(
			'/?param=one%20space',
			new Uri('/?param=one+space').toString()
		);
	});

	it('should remove dot segments from pathname', function() {
		assert.strictEqual('/a/', new Uri('./a/').getPathname());
		assert.strictEqual('/a/', new Uri('./a/b/c/../../').getPathname());
		assert.strictEqual('/a', new Uri('./a').getPathname());
		// assert.strictEqual('/a', new Uri('./a/b/c/../..').getPathname()); // This will only fail on browsers, and it's not yet supported by metal-uri
	});

	it('should support protocol relative uri', function() {
		const uri = new Uri('//hostname:123/path/data?key=value#hash');
		assert.strictEqual(
			'http://hostname:123/path/data?key=value#hash',
			uri.toString()
		);
	});

	it('should add parameters from MultiMap', function() {
		const uri = new Uri('?a=1');
		const map = new MultiMap();
		map.add('a', '2');
		map.add('a', '3');
		uri.addParametersFromMultiMap(map);
		assert.strictEqual('/?a=1&a=2&a=3', uri.toString());
	});

	it('should join paths', function() {
		assert.strictEqual('/foo', Uri.joinPaths('', 'foo'));
		assert.strictEqual('/foo', Uri.joinPaths('', 'foo/'));
		assert.strictEqual('foo', Uri.joinPaths('foo', ''));
		assert.strictEqual('foo', Uri.joinPaths('foo/', ''));
		assert.strictEqual('foo/bar', Uri.joinPaths('foo', '/bar'));
		assert.strictEqual('foo/bar', Uri.joinPaths('foo', 'bar'));
		assert.strictEqual('foo/bar', Uri.joinPaths('foo/', '/bar'));
		assert.strictEqual('foo/bar', Uri.joinPaths('foo/', 'bar'));
		assert.strictEqual(
			'foo/bar/bazz',
			Uri.joinPaths('foo', '/bar', 'bazz')
		);
		assert.strictEqual(
			'http://localhost:123',
			Uri.joinPaths('http://localhost:123', '')
		);
	});

	it('should convert numbers to strings before joining paths', function() {
		assert.strictEqual('foo/123', Uri.joinPaths('foo', 123));
		assert.strictEqual('123/foo', Uri.joinPaths(123, 'foo'));
		assert.strictEqual('1/2/3', Uri.joinPaths(1, 2, 3));
	});

	it('should make urls unique by adding a random param', function() {
		const uri = new Uri('foo.bar/path');
		const uri2 = new Uri('foo.bar/path');

		assert.strictEqual(uri.toString(), uri2.toString());

		uri.makeUnique();
		uri2.makeUnique();
		assert.notStrictEqual(uri.toString(), uri2.toString());
	});

	it('should remove uniqueness by removing the random param', function() {
		const uri = new Uri('foo.bar/path');
		const uri2 = new Uri('foo.bar/path');
		uri.makeUnique().removeUnique();
		uri2.makeUnique().removeUnique();
		assert.strictEqual(uri.toString(), uri2.toString());
	});

	it('should check if uri has parameter', function() {
		assert.ok(new Uri('?a=1').hasParameter('a'));
		assert.ok(!new Uri('?a=1').hasParameter('b'));
	});

	it('should preserve trailing slash on paths', function() {
		const uri = new Uri('http://hostname:8080/foo/');
		assert.strictEqual('http://hostname:8080/foo/', uri.toString());
	});

	it('should return information if default protocol was added to the uri', function() {
		let uri = new Uri('hostname:8080/foo/');
		assert.strictEqual('http://hostname:8080/foo/', uri.toString());
		assert.strictEqual(true, uri.isUsingDefaultProtocol());

		uri = new Uri('https://hostname:8080/foo/');
		assert.strictEqual('https://hostname:8080/foo/', uri.toString());
		assert.strictEqual(false, uri.isUsingDefaultProtocol());
	});

	it('should set protocol http: on localhost uri', function() {
		const uri = new Uri('localhost:8080');
		assert.strictEqual('http:', uri.getProtocol());
		assert.strictEqual('8080', uri.getPort());
	});

	it('should support useful types of uri schemes like "tel"', function() {
		const uri = new Uri('tel:pathname', false);
		assert.strictEqual('tel:', uri.getProtocol());
		assert.strictEqual('pathname', uri.getPathname());
		assert.strictEqual('tel:pathname', uri.toString());
	});

	it('should support uri schemes that include hyphens', function() {
		const uri = new Uri('ms-excel:pathname', false);
		assert.strictEqual('ms-excel:', uri.getProtocol());
		assert.strictEqual('pathname', uri.getPathname());
		assert.strictEqual('ms-excel:pathname', uri.toString());
	});

	it('should support uri schemes that include numerical values', function() {
		const uri = new Uri('pkcs11:pathname', false);
		assert.strictEqual('pkcs11:', uri.getProtocol());
		assert.strictEqual('pathname', uri.getPathname());
		assert.strictEqual('pkcs11:pathname', uri.toString());
	});

	it('should support uri schemes that include periods', function() {
		const uri = new Uri('iris.beep:pathname', false);
		assert.strictEqual('iris.beep:', uri.getProtocol());
		assert.strictEqual('pathname', uri.getPathname());
		assert.strictEqual('iris.beep:pathname', uri.toString());
	});

	it('should support uri schemes that include pluses', function() {
		const uri = new Uri('some+scheme:pathname', false);
		assert.strictEqual('some+scheme:', uri.getProtocol());
		assert.strictEqual('pathname', uri.getPathname());
		assert.strictEqual('some+scheme:pathname', uri.toString());
	});
});
