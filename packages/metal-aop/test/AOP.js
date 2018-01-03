'use strict';

import AOP from '../src/AOP';

const addSpy = sinon.spy();

describe('Ajax', function() {
	beforeEach(function() {
		addSpy.reset();
	});

	it('should call listener before original method', function() {
		const obj = new MyClass();
		const spy = sinon.spy();

		AOP.before(spy, obj, 'add');

		const retVal = obj.add(1, 2);

		assert.ok(addSpy.calledOnce);
		assert.ok(spy.calledOnce);
		assert.ok(spy.calledBefore(addSpy));
		assert.ok(spy.calledWith(1, 2));
		assert.strictEqual(retVal, 3);
	});

	it('should call listener after original method', function() {
		const obj = new MyClass();
		const spy = sinon.spy();

		AOP.after(spy, obj, 'add');

		const retVal = obj.add(1, 2);

		assert.ok(addSpy.calledOnce);
		assert.ok(spy.calledOnce);
		assert.ok(spy.calledAfter(addSpy));
		assert.ok(spy.calledWith(1, 2));
		assert.strictEqual(retVal, 3);
	});

	it('should call multiple listeners in correct order', function() {
		const obj = new MyClass();
		const spy1 = sinon.spy();
		const spy2 = sinon.spy();

		AOP.before(spy1, obj, 'add');
		AOP.before(spy2, obj, 'add');

		const retVal = obj.add(1, 2);

		assert.ok(addSpy.calledOnce);
		assert.ok(spy1.calledOnce);
		assert.ok(spy2.calledOnce);
		assert.ok(spy1.calledBefore(spy2));
		assert.ok(spy2.calledBefore(addSpy));
		assert.ok(spy1.calledWith(1, 2));
		assert.ok(spy2.calledWith(1, 2));
		assert.strictEqual(retVal, 3);
	});

	it('should not call listener if returned handle is removed', function() {
		const obj = new MyClass();
		const spy = sinon.spy();

		const handle = AOP.before(spy, obj, 'add');

		obj.add(1, 2);

		assert.ok(addSpy.calledOnce);
		assert.ok(spy.calledOnce);

		handle.removeListener();

		obj.add(1, 2);

		assert.ok(addSpy.calledTwice);
		assert.ok(spy.calledOnce);
	});

	it('should prevent wrapped function from firing when AOP.prevent is returned by listener', function() {
		const obj = new MyClass();

		AOP.before(function() {
			return AOP.prevent();
		}, obj, 'add');

		obj.add(1, 2);

		assert.ok(addSpy.notCalled);
	});

	it('should prevent wrapped function and all further subscribers from firing when AOP.halt is returned by listener', function() {
		const obj = new MyClass();
		const spy = sinon.spy();

		AOP.before(function() {
			return AOP.halt('new value');
		}, obj, 'add');
		AOP.before(spy, obj, 'add');

		const retVal = obj.add(1, 2);

		assert.ok(addSpy.notCalled);
		assert.ok(spy.notCalled);
		assert.strictEqual(retVal, 'new value');
	});

	it('should modify return value when AOP.alterReturn is returned by `after` listener', function() {
		const obj = new MyClass();

		AOP.after(function() {
			return AOP.alterReturn(AOP.currentRetVal + 1);
		}, obj, 'add');

		const retVal = obj.add(1, 2);

		assert.ok(addSpy.calledOnce);
		assert.strictEqual(retVal, 4);
	});
});

class MyClass {
	add(n1, n2) {
		addSpy();

		return n1 + n2;
	}
}
