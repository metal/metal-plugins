'use strict';

import { getChildrenMap, mergeChildrenMap } from '../src/utils';

describe('getChildrenMap', function() {
	it(
		'should create a keyed object based on props.key',
		() => {
			const arr = [
				{
					props: {
						key: 'foo'
					}
				},
				{
					props: {
						key: 'bar'
					}
				}
			];

			const obj = getChildrenMap(arr);

			expect(obj.get('foo')).toBe(arr[0]);
			expect(obj.get('bar')).toBe(arr[1]);
		}
	);

	it(
		'should create a keyed object based on props.key when keys are numbers',
		() => {
			const arr = [
				{
					props: {
						key: 2
					}
				},
				{
					props: {
						key: 1
					}
				}
			];

			const obj = getChildrenMap(arr);

			expect(obj.get(2)).toBe(arr[0]);
			expect(obj.get(1)).toBe(arr[1]);
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

			expect(mergedMap.get(2)).toBe('two');

			mergedMap = mergeChildrenMap(oldMap, newMap);

			expect(mergedMap.get(2)).toBe('twotwo');
		}
	);

	it(
		'should still work if no objects are supplied',
		() => {
			const obj = mergeChildrenMap();

			expect(obj instanceof Map);
		}
	);
});
