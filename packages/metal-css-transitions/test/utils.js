'use strict';

import { getChildrenMap, mergeChildrenMap } from '../src/utils';

describe('getChildrenMap', function() {
	it(
		'should create a keyed object based on config.key',
		() => {
			const arr = [
				{
					config: {
						key: 'foo'
					}
				},
				{
					config: {
						key: 'bar'
					}
				}
			];

			const obj = getChildrenMap(arr);

			assert.deepEqual(obj.foo, arr[0]);
			assert.deepEqual(obj.bar, arr[1]);
		}
	);
});

describe('mergeChildrenMap', function() {
	it(
		'should merge objects',
		() => {
			const newObj = {
				1: 1,
				2: 2
			};

			const oldObj = {
				2: 'two',
				3: 'three'
			};

			let mergedObj = mergeChildrenMap(newObj, oldObj);

			let expectedObj = {
				1: 1,
				2: 2,
				3: 'three'
			};

			assert.deepEqual(mergedObj, expectedObj);

			mergedObj = mergeChildrenMap(oldObj, newObj);

			expectedObj = {
				1: 1,
				2: 'two',
				3: 'three'
			};

			assert.deepEqual(mergedObj, expectedObj);
		}
	);

	it(
		'should still work if no objects are supplied',
		() => {
			const obj = mergeChildrenMap();

			assert(obj);
		}
	);
});
