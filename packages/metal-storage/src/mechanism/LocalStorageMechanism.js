'use strict';

import StorageMechanism from './StorageMechanism';

/**
 * Abstract interface for storing and retrieving data using some persistence
 * mechanism.
 * @constructor
 */
class LocalStorageMechanism extends StorageMechanism {
	/**
	 * Returns reference for global local storage. by default
	 */
	storage() {
		return LocalStorageMechanism.globals.localStorage;
	}

	/**
	 * @inheritDoc
	 */
	clear() {
		this.storage().clear();
	}

	/**
	 * @inheritDoc
	 */
	keys() {
		return Object.keys(this.storage());
	}

	/**
	 * @inheritDoc
	 */
	get(key) {
		return this.storage().getItem(key);
	}

	/**
	 * @inheritDoc
	 */
	static isSupported() {
		return typeof window !== 'undefined' &&
			typeof window.localStorage !== 'undefined';
	}

	/**
	 * @inheritDoc
	 */
	remove(key) {
		this.storage().removeItem(key);
	}

	/**
	 * @inheritDoc
	 */
	set(key, value) {
		this.storage().setItem(key, value);
	}

	/**
	 * @inheritDoc
	 */
	size() {
		return this.storage().length;
	}
}

if (LocalStorageMechanism.isSupported()) {
	LocalStorageMechanism.globals = {
		localStorage: window.localStorage
	};
}

export default LocalStorageMechanism;
