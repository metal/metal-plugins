'use strict';

import StorageMechanism from '../../src/mechanism/StorageMechanism';

describe('StorageMechanism', function() {
	it('should clear throws unimplemented exception', function() {
		assert.throws(() => new StorageMechanism().clear(), Error);
	});

	it('should set throws unimplemented exception', function() {
		assert.throws(() => new StorageMechanism().set('key', 'value'), Error);
	});

	it('should get throws unimplemented exception', function() {
		assert.throws(() => new StorageMechanism().get('key'), Error);
	});

	it('should keys throws unimplemented exception', function() {
		assert.throws(() => new StorageMechanism().keys(), Error);
	});

	it('should remove throws unimplemented exception', function() {
		assert.throws(() => new StorageMechanism().remove('key'), Error);
	});

	it('should size throws unimplemented exception', function() {
		assert.throws(() => new StorageMechanism().size(), Error);
	});

	it('should assume mechanism is supported by default', function() {
		assert.ok(StorageMechanism.isSupported());
	});
});
