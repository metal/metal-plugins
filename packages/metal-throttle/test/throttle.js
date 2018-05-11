'use strict';

import {throttle} from '../src/throttle';

describe('throttle', function() {
	it('should allow calling the given function immediatly', () => {
		const fn = sinon.spy();
		const throttledFn = throttle(fn, 1000);

		throttledFn('sample');
		assert.strictEqual(fn.callCount, 1);
	});

	it('should do nothing if the delay has not passed', done => {
		const fn = sinon.spy();
		const throttledFn = throttle(fn, 50);

		throttledFn('sample1');
		throttledFn('sample2');

		setTimeout(() => {
			throttledFn('sample3');

			assert.strictEqual(fn.callCount, 2);
			assert.deepEqual(fn.firstCall.args, ['sample1']);
			assert.deepEqual(fn.secondCall.args, ['sample3']);

			done();
		}, 100);
	});

	it('should catch and rethrow unexpedted errors', (done, fail) => {
		const fn = () => {
			throw new Error('sample');
		};
		const throttledFn = throttle(fn, 1000);

		try {
			throttledFn();
			fail();
		} catch (error) {
			done();
		}
	});

	it('should pass by all given arguments', () => {
		const fn = sinon.spy();
		const throttledFn = throttle(fn, 1000);

		throttledFn('sample1', 'sample2', 'sample3');

		assert.strictEqual(fn.callCount, 1);
		assert.deepEqual(fn.firstCall.args, ['sample1', 'sample2', 'sample3']);
	});
});
