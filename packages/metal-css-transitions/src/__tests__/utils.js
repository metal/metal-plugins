'use strict';

import {getChildrenMap, mergeChildrenMap} from '../utils';

describe('getChildrenMap', () => {
	it('should create a keyed object based on props.key', () => {
		const arr = [
			{
				props: {
					key: 'foo'
				},
				tag: 'div'
			},
			{
				props: {
					key: 'bar'
				},
				tag: 'div'
			}
		];

		const obj = getChildrenMap(arr);

		expect(obj).toMatchSnapshot();
	});

	it('should create a keyed object based on props.key when keys are numbers', () => {
		const arr = [
			{
				props: {
					key: 2
				},
				tag: 'div'
			},
			{
				props: {
					key: 1
				},
				tag: 'div'
			}
		];

		const obj = getChildrenMap(arr);

		expect(obj).toMatchSnapshot();
	});

	it('should create a keyed object even if tag is all sorts of types', () => {
		const arr = [
			{
				props: {},
				tag: 'div'
			},
			{
				props: {},
				tag: function testTest() {}
			},
			{
				props: {},
				tag: {foo: 'bar'}
			},
			{
				props: {}
			}
		];

		const obj = getChildrenMap(arr);

		expect(obj).toMatchSnapshot();
	});
});

describe('mergeChildrenMap', () => {
	it('should merge objects', () => {
		const newMap = new Map([[1, 'one'], [2, 'two']]);

		const oldMap = new Map([[2, 'twotwo'], [3, 'three']]);

		let mergedMap = mergeChildrenMap(newMap, oldMap);

		expect(mergedMap.get(2)).toBe('two');

		mergedMap = mergeChildrenMap(oldMap, newMap);

		expect(mergedMap.get(2)).toBe('twotwo');
	});

	it('should still work if no objects are supplied', () => {
		const obj = mergeChildrenMap();

		expect(obj instanceof Map);
	});
});
