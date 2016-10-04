'use strict';

/* jshint ignore:start */

/**
 * Abstract interface for storing and retrieving data using some persistence
 * mechanism.
 * @constructor
 */
class StorageMechanism {
	/**
	 * Clear all items from the data storage.
	 */
	clear() {
		throw Error('Unimplemented abstract method');
	}

	/**
	 * Sets an item in the data storage.
	 * @param {string} key The key to set.
	 * @param {*} value The value to serialize to a string and save.
	 */
	set(key, value) {
		throw Error('Unimplemented abstract method');
	}

	/**
	 * Gets an item from the data storage.
	 * @param {string} key The key to get.
	 * @return {*} Deserialized value or undefined if not found.
	 */
	get(key) {
		throw Error('Unimplemented abstract method');
	}

	/**
	 * Checks if this mechanism is supported in the current environment.
	 * Subclasses should override this when necessary.
	 */
	static isSupported() {
		return true;
	}

	/**
	 * Returns the list of keys stored in the Storage object.
	 * @param {!Array<string>} keys
	 */
	keys() {
		throw Error('Unimplemented abstract method');
	}

	/**
	 * Removes an item from the data storage.
	 * @param {string} key The key to remove.
	 */
	remove(key) {
		throw Error('Unimplemented abstract method');
	}

	/**
	 * Returns the number of data items stored in the Storage object.
	 * @return {number}
	 */
	size() {
		throw Error('Unimplemented abstract method');
	}
}

export default StorageMechanism;

/* jshint ignore:end */
