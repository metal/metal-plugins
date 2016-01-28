'use strict';

import Uri from '../src/Uri';

describe('Uri', function() {
	it('should support empty uri', function() {
		var uri = new Uri();
		assert.strictEqual('/', uri.getPathname());
		assert.strictEqual('/', uri.toString());
	});

	it('should get uri hostname', function() {
		var uri = new Uri('http://hostname:8080');
		assert.strictEqual('hostname', uri.getHostname());
	});

	it('should get uri host', function() {
		var uri = new Uri('http://hostname:8080');
		assert.strictEqual('hostname:8080', uri.getHost());
	});

	it('should get uri origin', function() {
		var uri = new Uri('http://hostname:8080/ignore');
		assert.strictEqual('http://hostname:8080', uri.getOrigin());
	});

	it('should hostname be empty for empty uri', function() {
		var uri = new Uri();
		assert.strictEqual('', uri.getHostname());
	});

	it('should host be empty for empty uri', function() {
		var uri = new Uri();
		assert.strictEqual('', uri.getHost());
	});

	it('should origin be empty for empty uri', function() {
		var uri = new Uri();
		assert.strictEqual('', uri.getOrigin());
	});

	it('should support set port on uri', function() {
		var uri = new Uri('hostname:8080');
		assert.strictEqual('8080', uri.getPort());
		uri.setPort(81);
		assert.strictEqual('81', uri.getPort());
	});

	it('should support set protocol on uri', function() {
		var uri = new Uri('http://hostname');
		assert.strictEqual('http:', uri.getProtocol());
		uri.setProtocol('https');
		assert.strictEqual('https:', uri.getProtocol());
		uri.setProtocol('https:');
		assert.strictEqual('https:', uri.getProtocol());
	});

	it('should support only hostname', function() {
		var uri = new Uri('hostname');
		assert.strictEqual('hostname', uri.getHostname());
		assert.strictEqual('http://hostname/', uri.toString());
	});

	it('should support only hostname from setter', function() {
		var uri = new Uri();
		uri.setHostname('hostname');
		assert.strictEqual('hostname', uri.getHostname());
		assert.strictEqual('http://hostname/', uri.toString());
	});

	it('should support only pathname', function() {
		var uri = new Uri('/pathname');
		assert.strictEqual('/pathname', uri.getPathname());
		assert.strictEqual('/pathname', uri.toString());
	});

	it('should support only pathname from setter', function() {
		var uri = new Uri();
		uri.setPathname('/pathname');
		assert.strictEqual('/pathname', uri.getPathname());
		assert.strictEqual('/pathname', uri.toString());
	});

	it('should support only hash', function() {
		var uri = new Uri('#hash');
		assert.strictEqual('#hash', uri.getHash());
		assert.strictEqual('/#hash', uri.toString());
	});

	it('should support only hash from setter', function() {
		var uri = new Uri();
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
		var uri = new Uri('/pathname?a=1');
		assert.strictEqual('?a=1', uri.getSearch());
		assert.strictEqual('/pathname', uri.getPathname());
		assert.strictEqual('/pathname?a=1', uri.toString());
	});

	it('should support pathname with search and hash', function() {
		var uri = new Uri('/pathname?a=1#hash');
		assert.strictEqual('#hash', uri.getHash());
		assert.strictEqual('?a=1', uri.getSearch());
		assert.strictEqual('/pathname', uri.getPathname());
		assert.strictEqual('/pathname?a=1#hash', uri.toString());
	});

	it('should support username and password', function() {
		var uri = new Uri('http://user:pass@hostname');
		assert.strictEqual('user', uri.getUsername());
		assert.strictEqual('pass', uri.getPassword());
		assert.strictEqual('http://user:pass@hostname/', uri.toString());
	});

	it('should support username and password from setter', function() {
		var uri = new Uri('http://hostname');
		uri.setUsername('user');
		uri.setPassword('pass');
		assert.strictEqual('user', uri.getUsername());
		assert.strictEqual('pass', uri.getPassword());
		assert.strictEqual('http://user:pass@hostname/', uri.toString());
	});

	it('should initialize parameters from search part of uri', function() {
		var uri = new Uri('http://hostname?a=1&b=2');
		assert.strictEqual('1', uri.getParameterValue('a'));
		assert.strictEqual('2', uri.getParameterValue('b'));
	});

	it('should set parameter value in uri', function() {
		var uri = new Uri();
		uri.setParameterValue('a', '1');
		uri.setParameterValue('a', '2');
		assert.strictEqual('2', uri.getParameterValue('a'));
		assert.deepEqual(['2'], uri.getParameterValues('a'));
	});

	it('should set parameter values in uri', function() {
		var uri = new Uri();
		uri.setParameterValues('a', ['1', '2']);
		assert.strictEqual('1', uri.getParameterValue('a'));
		assert.deepEqual(['1', '2'], uri.getParameterValues('a'));
	});

	it('should add parameter value in uri', function() {
		var uri = new Uri();
		uri.addParameterValue('a', '1');
		uri.addParameterValue('a', '2');
		assert.strictEqual('1', uri.getParameterValue('a'));
		assert.deepEqual(['1', '2'], uri.getParameterValues('a'));
	});

	it('should add parameter values in uri', function() {
		var uri = new Uri();
		uri.addParameterValues('a', ['1', '2']);
		assert.strictEqual('1', uri.getParameterValue('a'));
		assert.deepEqual(['1', '2'], uri.getParameterValues('a'));
	});

	it('should remove parameter in uri', function() {
		var uri = new Uri();
		uri.setParameterValue('a', '1');
		uri.removeParameter('a');
		assert.strictEqual(undefined, uri.getParameterValue('a'));
	});

	it('should add parameter value in uri be case insensitive', function() {
		var uri = new Uri();
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
		var uri = new Uri();
		uri.setParameterValue('a', 'one space');
		assert.strictEqual('one space', uri.getParameterValue('a'));
		assert.strictEqual('/?a=one%20space', uri.toString());
	});

	it('should parameter value preserve encoding', function() {
		var uri = new Uri();
		uri.setParameterValue('a', 'one%20space');
		assert.strictEqual('one%20space', uri.getParameterValue('a'));
		assert.strictEqual('/?a=one%2520space', uri.toString());
	});

	it('should parameter value in url preserve encoding', function() {
		var uri = new Uri('?a=one%20space');
		assert.strictEqual('one space', uri.getParameterValue('a'));
		assert.strictEqual('/?a=one%20space', uri.toString());
	});

	it('should remove dot segments from pathname', function() {
		assert.strictEqual('/a/', new Uri('./a/').getPathname());
		assert.strictEqual('/a/', new Uri('./a/b/c/../..').getPathname());
	});

});
