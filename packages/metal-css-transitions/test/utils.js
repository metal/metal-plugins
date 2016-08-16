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

			assert.strictEqual(obj.get('foo'), arr[0]);
			assert.strictEqual(obj.get('bar'), arr[1]);
		}
	);

	it(
		'should create a keyed object based on config.key when keys are numbers',
		() => {
			const arr = [
				{
					config: {
						key: 2
					}
				},
				{
					config: {
						key: 1
					}
				}
			];

			const obj = getChildrenMap(arr);

			assert.strictEqual(obj.get(2), arr[0]);
			assert.strictEqual(obj.get(1), arr[1]);
		}
	);
});

describe('mergeChildrenMap', function() {
	it(
		'should merge objects',
		() => {
			const newMap = new Map(
				[
					[1, 'one'],
					[2, 'two']
				]
			);

			const oldMap = new Map(
				[
					[2, 'twotwo'],
					[3, 'three']
				]
			);

			let mergedMap = mergeChildrenMap(newMap, oldMap);

			assert.strictEqual(mergedMap.get(2), 'two');

			mergedMap = mergeChildrenMap(oldMap, newMap);

			assert.strictEqual(mergedMap.get(2), 'twotwo');
		}
	);

	it(
		'should still work if no objects are supplied',
		() => {
			const obj = mergeChildrenMap();

			assert(obj instanceof Map);
		}
	);
});
