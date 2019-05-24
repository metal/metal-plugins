'use strict';

import Geometry from '../src/Geometry';

describe('Geometry', function() {
	it('should overlapped rectangles intersects', function() {
		const P01 = [0, 0];
		const P02 = [10, 10];
		const P11 = [0, 0];
		const P12 = [10, 10];
		assert.ok(
			Geometry.intersectRect(
				P01[0],
				P01[1],
				P02[0],
				P02[1],
				P11[0],
				P11[1],
				P12[0],
				P12[1]
			)
		);
	});

	it('should internal rectangles intersects', function() {
		const P01 = [0, 0];
		const P02 = [10, 10];
		const P11 = [1, 1];
		const P12 = [9, 9];
		assert.ok(
			Geometry.intersectRect(
				P01[0],
				P01[1],
				P02[0],
				P02[1],
				P11[0],
				P11[1],
				P12[0],
				P12[1]
			)
		);
	});

	it('should partially overlapped rectangles intersects', function() {
		const P01 = [0, 0];
		const P02 = [10, 10];
		const P11 = [9, 9];
		const P12 = [1, 1];
		assert.ok(
			Geometry.intersectRect(
				P01[0],
				P01[1],
				P02[0],
				P02[1],
				P11[0],
				P11[1],
				P12[0],
				P12[1]
			)
		);
	});

	it('should external rectangles not intersect', function() {
		const P01 = [0, 0];
		const P02 = [10, 10];
		const P11 = [11, 11];
		const P12 = [12, 12];
		assert.ok(
			!Geometry.intersectRect(
				P01[0],
				P01[1],
				P02[0],
				P02[1],
				P11[0],
				P11[1],
				P12[0],
				P12[1]
			)
		);
	});
});
