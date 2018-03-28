'use strict';

import core from 'metal';
import StorageMechanism from './mechanism/StorageMechanism';

class Storage {

	/**
	 * Provides a convenient API for data persistence using a selected data
	 * storage mechanism.
	 * @param {!StorageMechanism} mechanism The underlying storage mechanism.
	 * @constructor
	 */
	constructor(mechanism) {
		assertMechanismDefAndNotNull(mechanism);
		assertMechanismInstanceOf(mechanism);

		/**
		 * The mechanism used to persist key-value pairs.
		 * @type {StorageMechanism}
		 * @protected
		 */
		this.mechanism = mechanism;
	}

	/**
	 * Clear all items from the data storage.
	 */
	clear() {
		this.mechanism.clear();
	}

	/**
	 * Sets an item in the data storage.
	 * @param {string} key The key to set.
	 * @param {*} value The value to serialize to a string and save.
	 */
	set(key, value) {
		if (!core.isDef(value)) {
			this.mechanism.remove(key);
			return;
		}
		this.mechanism.set(key, JSON.stringify(value));
	}

	/**
	 * Gets an item from the data storage.
	 * @param {string} key The key to get.
	 * @return {*} Deserialized value or undefined if not found.
	 */
	get(key) {
		var json;
		try {
			json = this.mechanism.get(key);
		} catch (e) {
			return undefined;
		}
		if (core.isNull(json)) {
			return undefined;
		}
		try {
			return JSON.parse(json);
		} catch (e) {
			throw Storage.ErrorCode.INVALID_VALUE;
		}
	}

	/**
	 * Returns the list of keys stored in the Storage object.
	 * @param {!Array<string>} keys
	 */
	keys() {
		return this.mechanism.keys();
	}

	/**
	 * Removes an item from the data storage.
	 * @param {string} key The key to remove.
	 */
	remove(key) {
		this.mechanism.remove(key);
	}

	/**
	 * Returns the number of data items stored in the Storage object.
	 * @return {number}
	 */
	size() {
		return this.mechanism.size();
	}

	/**
	 * Returns the list of values stored in the Storage object.
	 * @param {!Array<string>} values
	 */
	values() {
		return this.keys().map((key) => this.get(key));
	}
}

/**
 * Errors thrown by the storage.
 * @enum {string}
 */
Storage.ErrorCode = {
	INVALID_VALUE: 'Storage: Invalid value was encountered'
};

function assertMechanismDefAndNotNull(mechanism) {
	if (!core.isDefAndNotNull(mechanism)) {
		throw Error('Storage mechanism is required');
	}
}

function assertMechanismInstanceOf(mechanism) {
	if (!(mechanism instanceof StorageMechanism)) {
		throw Error('Storage mechanism must me an implementation of StorageMechanism');
	}
}

export default Storage;
