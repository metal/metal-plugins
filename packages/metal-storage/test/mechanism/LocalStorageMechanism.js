'use strict';

import LocalStorageMechanism from '../../src/mechanism/LocalStorageMechanism';

describe('LocalStorageMechanism', function() {
	if (!LocalStorageMechanism.isSupported()) {
		return;
	}

	beforeEach(function() {
		var storage = new LocalStorageMechanism();
		storage.clear();
	});

	it('should set string value', function() {
		var storage = new LocalStorageMechanism();
		storage.set('key', 'value');
		assert.strictEqual('value', storage.get('key'));
	});

	it('should set stores non-string values as string', function() {
		var storage = new LocalStorageMechanism();
		storage.set('key', {});
		assert.strictEqual('[object Object]', storage.get('key'));
	});

	it('should set stores null value as string', function() {
		var storage = new LocalStorageMechanism();
		storage.set('key', null);
		assert.strictEqual('null', storage.get('key'));
	});

	it('should set stores undefined value as string', function() {
		var storage = new LocalStorageMechanism();
		storage.set('key', undefined);
		assert.strictEqual('undefined', storage.get('key'));
	});

	it('should clear all values from storage', function() {
		var storage = new LocalStorageMechanism();
		storage.set('key', 'value');
		assert.strictEqual(1, storage.size());
		storage.clear();
		assert.strictEqual(0, storage.size());
	});

	it('should get keys from storage', function() {
		var storage = new LocalStorageMechanism();
		storage.set('key1', 'value1');
		storage.set('key2', 'value2');
		assert.deepEqual(['key1', 'key2'], storage.keys());
	});

	it('should remove a value from a key', function() {
		var storage = new LocalStorageMechanism();
		storage.set('key1', 'value');
		storage.set('key2', 'value');
		assert.strictEqual(2, storage.size());
		storage.remove('key1');
		assert.strictEqual(1, storage.size());
	});
});
