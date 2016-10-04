'use strict';

import Storage from '../src/Storage';
import LocalStorageMechanism from '../src/mechanism/LocalStorageMechanism';

describe('Storage', function() {
	it('should throws error for missing mechanism', function() {
		assert.throws(() => new Storage(), Error);
	});

	it('should throws error for wrong type mechanism', function() {
		var unnkownType = {};
		assert.throws(() => new Storage(unnkownType), Error);
	});

	describe('LocalStorageMechanism', function() {
		if (!LocalStorageMechanism.isSupported()) {
			return;
		}

		beforeEach(function() {
			this.mechanism = new LocalStorageMechanism();
			this.mechanism.clear();
		});

		it('should set string value', function() {
			var storage = new Storage(this.mechanism);
			storage.set('key', 'value');
			assert.strictEqual('value', storage.get('key'));
		});

		it('should set stores values as json objects', function() {
			var storage = new Storage(this.mechanism);
			var obj = {
				key: 1
			};
			storage.set('key', obj);
			assert.deepEqual(obj, storage.get('key'));
		});

		it('should set stores null value as null', function() {
			var storage = new Storage(this.mechanism);
			storage.set('key', null);
			assert.strictEqual(null, storage.get('key'));
		});

		it('should set stores undefined value as undefined', function() {
			var storage = new Storage(this.mechanism);
			storage.set('key', undefined);
			assert.strictEqual(undefined, storage.get('key'));
		});

		it('should clear all values from storage', function() {
			var storage = new Storage(this.mechanism);
			storage.set('key', 'value');
			assert.strictEqual(1, storage.size());
			storage.clear();
			assert.strictEqual(0, storage.size());
		});

		it('should get keys from storage', function() {
			var storage = new Storage(this.mechanism);
			storage.set('key1', 'value1');
			storage.set('key2', 'value2');
			assert.deepEqual(['key1', 'key2'], storage.keys());
		});

		it('should get values from storage', function() {
			var storage = new Storage(this.mechanism);
			storage.set('key1', 'value1');
			storage.set('key2', 'value2');
			assert.deepEqual(['value1', 'value2'], storage.values());
		});

		it('should remove a value from a key', function() {
			var storage = new Storage(this.mechanism);
			storage.set('key1', 'value');
			storage.set('key2', 'value');
			assert.strictEqual(2, storage.size());
			storage.remove('key1');
			assert.strictEqual(1, storage.size());
		});

		it('should get returns undefined for issues within mechanism get', function() {
			class MockMechanism extends LocalStorageMechanism {
				get() {
					throw Error();
				}
			}
			var storage = new Storage(new MockMechanism());
			assert.strictEqual(undefined, storage.get());
		});

		it('should get returns Storage.ErrorCode.INVALID_VALUE for issues within mechanism deserialization', function() {
			class MockMechanism extends LocalStorageMechanism {
				get() {
					return '{';
				}
			}
			var storage = new Storage(new MockMechanism());
			assert.throws(() => storage.get(), Storage.ErrorCode.INVALID_VALUE);
		});
	});
});
