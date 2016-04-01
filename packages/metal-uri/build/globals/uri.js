(function() {
this.metal = this.metal || {};
this.metalNamed = this.metalNamed || {};
var babelHelpers = {};
babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

babelHelpers.possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

babelHelpers.slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

babelHelpers;
'use strict';

/**
 * A collection of core utility functions.
 * @const
 */

(function () {
	var core = function () {
		function core() {
			babelHelpers.classCallCheck(this, core);
		}

		/**
   * When defining a class Foo with an abstract method bar(), you can do:
   * Foo.prototype.bar = core.abstractMethod
   *
   * Now if a subclass of Foo fails to override bar(), an error will be thrown
   * when bar() is invoked.
   *
   * @type {!Function}
   * @throws {Error} when invoked to indicate the method should be overridden.
   */

		core.abstractMethod = function abstractMethod() {
			throw Error('Unimplemented abstract method');
		};

		/**
   * Loops constructor super classes collecting its properties values. If
   * property is not available on the super class `undefined` will be
   * collected as value for the class hierarchy position.
   * @param {!function()} constructor Class constructor.
   * @param {string} propertyName Property name to be collected.
   * @return {Array.<*>} Array of collected values.
   * TODO(*): Rethink superclass loop.
   */


		core.collectSuperClassesProperty = function collectSuperClassesProperty(constructor, propertyName) {
			var propertyValues = [constructor[propertyName]];
			while (constructor.__proto__ && !constructor.__proto__.isPrototypeOf(Function)) {
				constructor = constructor.__proto__;
				propertyValues.push(constructor[propertyName]);
			}
			return propertyValues;
		};

		/**
   * Gets the name of the given function. If the current browser doesn't
   * support the `name` property, this will calculate it from the function's
   * content string.
   * @param {!function()} fn
   * @return {string}
   */


		core.getFunctionName = function getFunctionName(fn) {
			if (!fn.name) {
				var str = fn.toString();
				fn.name = str.substring(9, str.indexOf('('));
			}
			return fn.name;
		};

		/**
   * Gets an unique id. If `opt_object` argument is passed, the object is
   * mutated with an unique id. Consecutive calls with the same object
   * reference won't mutate the object again, instead the current object uid
   * returns. See {@link core.UID_PROPERTY}.
   * @type {opt_object} Optional object to be mutated with the uid. If not
   *     specified this method only returns the uid.
   * @throws {Error} when invoked to indicate the method should be overridden.
   */


		core.getUid = function getUid(opt_object) {
			if (opt_object) {
				return opt_object[core.UID_PROPERTY] || (opt_object[core.UID_PROPERTY] = core.uniqueIdCounter_++);
			}
			return core.uniqueIdCounter_++;
		};

		/**
   * The identity function. Returns its first argument.
   * @param {*=} opt_returnValue The single value that will be returned.
   * @return {?} The first argument.
   */


		core.identityFunction = function identityFunction(opt_returnValue) {
			return opt_returnValue;
		};

		/**
   * Returns true if the specified value is a boolean.
   * @param {?} val Variable to test.
   * @return {boolean} Whether variable is boolean.
   */


		core.isBoolean = function isBoolean(val) {
			return typeof val === 'boolean';
		};

		/**
   * Returns true if the specified value is not undefined.
   * @param {?} val Variable to test.
   * @return {boolean} Whether variable is defined.
   */


		core.isDef = function isDef(val) {
			return val !== undefined;
		};

		/**
   * Returns true if value is not undefined or null.
   * @param {*} val
   * @return {Boolean}
   */


		core.isDefAndNotNull = function isDefAndNotNull(val) {
			return core.isDef(val) && !core.isNull(val);
		};

		/**
   * Returns true if value is a document.
   * @param {*} val
   * @return {Boolean}
   */


		core.isDocument = function isDocument(val) {
			return val && (typeof val === 'undefined' ? 'undefined' : babelHelpers.typeof(val)) === 'object' && val.nodeType === 9;
		};

		/**
   * Returns true if value is a dom element.
   * @param {*} val
   * @return {Boolean}
   */


		core.isElement = function isElement(val) {
			return val && (typeof val === 'undefined' ? 'undefined' : babelHelpers.typeof(val)) === 'object' && val.nodeType === 1;
		};

		/**
   * Returns true if the specified value is a function.
   * @param {?} val Variable to test.
   * @return {boolean} Whether variable is a function.
   */


		core.isFunction = function isFunction(val) {
			return typeof val === 'function';
		};

		/**
   * Returns true if value is null.
   * @param {*} val
   * @return {Boolean}
   */


		core.isNull = function isNull(val) {
			return val === null;
		};

		/**
   * Returns true if the specified value is a number.
   * @param {?} val Variable to test.
   * @return {boolean} Whether variable is a number.
   */


		core.isNumber = function isNumber(val) {
			return typeof val === 'number';
		};

		/**
   * Returns true if value is a window.
   * @param {*} val
   * @return {Boolean}
   */


		core.isWindow = function isWindow(val) {
			return val !== null && val === val.window;
		};

		/**
   * Returns true if the specified value is an object. This includes arrays
   * and functions.
   * @param {?} val Variable to test.
   * @return {boolean} Whether variable is an object.
   */


		core.isObject = function isObject(val) {
			var type = typeof val === 'undefined' ? 'undefined' : babelHelpers.typeof(val);
			return type === 'object' && val !== null || type === 'function';
		};

		/**
   * Returns true if value is a Promise.
   * @param {*} val
   * @return {Boolean}
   */


		core.isPromise = function isPromise(val) {
			return val && (typeof val === 'undefined' ? 'undefined' : babelHelpers.typeof(val)) === 'object' && typeof val.then === 'function';
		};

		/**
   * Returns true if value is a string.
   * @param {*} val
   * @return {Boolean}
   */


		core.isString = function isString(val) {
			return typeof val === 'string';
		};

		/**
   * Merges the values of a static property a class with the values of that
   * property for all its super classes, and stores it as a new static
   * property of that class. If the static property already existed, it won't
   * be recalculated.
   * @param {!function()} constructor Class constructor.
   * @param {string} propertyName Property name to be collected.
   * @param {function(*, *):*=} opt_mergeFn Function that receives an array filled
   *   with the values of the property for the current class and all its super classes.
   *   Should return the merged value to be stored on the current class.
   * @return {boolean} Returns true if merge happens, false otherwise.
   */


		core.mergeSuperClassesProperty = function mergeSuperClassesProperty(constructor, propertyName, opt_mergeFn) {
			var mergedName = propertyName + '_MERGED';
			if (constructor.hasOwnProperty(mergedName)) {
				return false;
			}

			var merged = core.collectSuperClassesProperty(constructor, propertyName);
			if (opt_mergeFn) {
				merged = opt_mergeFn(merged);
			}
			constructor[mergedName] = merged;
			return true;
		};

		/**
   * Null function used for default values of callbacks, etc.
   * @return {void} Nothing.
   */


		core.nullFunction = function nullFunction() {};

		return core;
	}();

	/**
  * Unique id property prefix.
  * @type {String}
  * @protected
  */


	core.UID_PROPERTY = 'core_' + (Math.random() * 1e9 >>> 0);

	/**
  * Counter for unique id.
  * @type {Number}
  * @private
  */
	core.uniqueIdCounter_ = 1;

	this.metal.core = core;
}).call(this);
'use strict';

(function () {
	var core = this.metal.core;

	var array = function () {
		function array() {
			babelHelpers.classCallCheck(this, array);
		}

		/**
   * Checks if the given arrays have the same content.
   * @param {!Array<*>} arr1
   * @param {!Array<*>} arr2
   * @return {boolean}
   */

		array.equal = function equal(arr1, arr2) {
			if (arr1.length !== arr2.length) {
				return false;
			}
			for (var i = 0; i < arr1.length; i++) {
				if (arr1[i] !== arr2[i]) {
					return false;
				}
			}
			return true;
		};

		/**
   * Returns the first value in the given array that isn't undefined.
   * @param {!Array} arr
   * @return {*}
   */


		array.firstDefinedValue = function firstDefinedValue(arr) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] !== undefined) {
					return arr[i];
				}
			}
		};

		/**
   * Transforms the input nested array to become flat.
   * @param {Array.<*|Array.<*>>} arr Nested array to flatten.
   * @param {Array.<*>} opt_output Optional output array.
   * @return {Array.<*>} Flat array.
   */


		array.flatten = function flatten(arr, opt_output) {
			var output = opt_output || [];
			for (var i = 0; i < arr.length; i++) {
				if (Array.isArray(arr[i])) {
					array.flatten(arr[i], output);
				} else {
					output.push(arr[i]);
				}
			}
			return output;
		};

		/**
   * Removes the first occurrence of a particular value from an array.
   * @param {Array.<T>} arr Array from which to remove value.
   * @param {T} obj Object to remove.
   * @return {boolean} True if an element was removed.
   * @template T
   */


		array.remove = function remove(arr, obj) {
			var i = arr.indexOf(obj);
			var rv;
			if (rv = i >= 0) {
				array.removeAt(arr, i);
			}
			return rv;
		};

		/**
   * Removes from an array the element at index i
   * @param {Array} arr Array or array like object from which to remove value.
   * @param {number} i The index to remove.
   * @return {boolean} True if an element was removed.
   */


		array.removeAt = function removeAt(arr, i) {
			return Array.prototype.splice.call(arr, i, 1).length === 1;
		};

		/**
   * Slices the given array, just like Array.prototype.slice, but this
   * is faster and working on all array-like objects (like arguments).
   * @param {!Object} arr Array-like object to slice.
   * @param {number} start The index that should start the slice.
   * @param {number=} opt_end The index where the slice should end, not
   *   included in the final array. If not given, all elements after the
   *   start index will be included.
   * @return {!Array}
   */


		array.slice = function slice(arr, start, opt_end) {
			var sliced = [];
			var end = core.isDef(opt_end) ? opt_end : arr.length;
			for (var i = start; i < end; i++) {
				sliced.push(arr[i]);
			}
			return sliced;
		};

		return array;
	}();

	this.metal.array = array;
}).call(this);
/*!
 * Polyfill from Google's Closure Library.
 * Copyright 2013 The Closure Library Authors. All Rights Reserved.
 */

'use strict';

(function () {
	var async = {};

	/**
  * Throw an item without interrupting the current execution context.  For
  * example, if processing a group of items in a loop, sometimes it is useful
  * to report an error while still allowing the rest of the batch to be
  * processed.
  * @param {*} exception
  */
	async.throwException = function (exception) {
		// Each throw needs to be in its own context.
		async.nextTick(function () {
			throw exception;
		});
	};

	/**
  * Fires the provided callback just before the current callstack unwinds, or as
  * soon as possible after the current JS execution context.
  * @param {function(this:THIS)} callback
  * @param {THIS=} opt_context Object to use as the "this value" when calling
  *     the provided function.
  * @template THIS
  */
	async.run = function (callback, opt_context) {
		if (!async.run.workQueueScheduled_) {
			// Nothing is currently scheduled, schedule it now.
			async.nextTick(async.run.processWorkQueue);
			async.run.workQueueScheduled_ = true;
		}

		async.run.workQueue_.push(new async.run.WorkItem_(callback, opt_context));
	};

	/** @private {boolean} */
	async.run.workQueueScheduled_ = false;

	/** @private {!Array.<!async.run.WorkItem_>} */
	async.run.workQueue_ = [];

	/**
  * Run any pending async.run work items. This function is not intended
  * for general use, but for use by entry point handlers to run items ahead of
  * async.nextTick.
  */
	async.run.processWorkQueue = function () {
		// NOTE: additional work queue items may be pushed while processing.
		while (async.run.workQueue_.length) {
			// Don't let the work queue grow indefinitely.
			var workItems = async.run.workQueue_;
			async.run.workQueue_ = [];
			for (var i = 0; i < workItems.length; i++) {
				var workItem = workItems[i];
				try {
					workItem.fn.call(workItem.scope);
				} catch (e) {
					async.throwException(e);
				}
			}
		}

		// There are no more work items, reset the work queue.
		async.run.workQueueScheduled_ = false;
	};

	/**
  * @constructor
  * @final
  * @struct
  * @private
  *
  * @param {function()} fn
  * @param {Object|null|undefined} scope
  */
	async.run.WorkItem_ = function (fn, scope) {
		/** @const */
		this.fn = fn;
		/** @const */
		this.scope = scope;
	};

	/**
  * Fires the provided callbacks as soon as possible after the current JS
  * execution context. setTimeout(…, 0) always takes at least 5ms for legacy
  * reasons.
  * @param {function(this:SCOPE)} callback Callback function to fire as soon as
  *     possible.
  * @param {SCOPE=} opt_context Object in whose scope to call the listener.
  * @template SCOPE
  */
	async.nextTick = function (callback, opt_context) {
		var cb = callback;
		if (opt_context) {
			cb = callback.bind(opt_context);
		}
		cb = async.nextTick.wrapCallback_(cb);
		// Introduced and currently only supported by IE10.
		// Verify if variable is defined on the current runtime (i.e., node, browser).
		// Can't use typeof enclosed in a function (such as core.isFunction) or an
		// exception will be thrown when the function is called on an environment
		// where the variable is undefined.
		if (typeof setImmediate === 'function') {
			setImmediate(cb);
			return;
		}
		// Look for and cache the custom fallback version of setImmediate.
		if (!async.nextTick.setImmediate_) {
			async.nextTick.setImmediate_ = async.nextTick.getSetImmediateEmulator_();
		}
		async.nextTick.setImmediate_(cb);
	};

	/**
  * Cache for the setImmediate implementation.
  * @type {function(function())}
  * @private
  */
	async.nextTick.setImmediate_ = null;

	/**
  * Determines the best possible implementation to run a function as soon as
  * the JS event loop is idle.
  * @return {function(function())} The "setImmediate" implementation.
  * @private
  */
	async.nextTick.getSetImmediateEmulator_ = function () {
		// Create a private message channel and use it to postMessage empty messages
		// to ourselves.
		var Channel;

		// Verify if variable is defined on the current runtime (i.e., node, browser).
		// Can't use typeof enclosed in a function (such as core.isFunction) or an
		// exception will be thrown when the function is called on an environment
		// where the variable is undefined.
		if (typeof MessageChannel === 'function') {
			Channel = MessageChannel;
		}

		// If MessageChannel is not available and we are in a browser, implement
		// an iframe based polyfill in browsers that have postMessage and
		// document.addEventListener. The latter excludes IE8 because it has a
		// synchronous postMessage implementation.
		if (typeof Channel === 'undefined' && typeof window !== 'undefined' && window.postMessage && window.addEventListener) {
			/** @constructor */
			Channel = function Channel() {
				// Make an empty, invisible iframe.
				var iframe = document.createElement('iframe');
				iframe.style.display = 'none';
				iframe.src = '';
				document.documentElement.appendChild(iframe);
				var win = iframe.contentWindow;
				var doc = win.document;
				doc.open();
				doc.write('');
				doc.close();
				var message = 'callImmediate' + Math.random();
				var origin = win.location.protocol + '//' + win.location.host;
				var onmessage = function (e) {
					// Validate origin and message to make sure that this message was
					// intended for us.
					if (e.origin !== origin && e.data !== message) {
						return;
					}
					this.port1.onmessage();
				}.bind(this);
				win.addEventListener('message', onmessage, false);
				this.port1 = {};
				this.port2 = {
					postMessage: function postMessage() {
						win.postMessage(message, origin);
					}
				};
			};
		}
		if (typeof Channel !== 'undefined') {
			var channel = new Channel();
			// Use a fifo linked list to call callbacks in the right order.
			var head = {};
			var tail = head;
			channel.port1.onmessage = function () {
				head = head.next;
				var cb = head.cb;
				head.cb = null;
				cb();
			};
			return function (cb) {
				tail.next = {
					cb: cb
				};
				tail = tail.next;
				channel.port2.postMessage(0);
			};
		}
		// Implementation for IE6-8: Script elements fire an asynchronous
		// onreadystatechange event when inserted into the DOM.
		if (typeof document !== 'undefined' && 'onreadystatechange' in document.createElement('script')) {
			return function (cb) {
				var script = document.createElement('script');
				script.onreadystatechange = function () {
					// Clean up and call the callback.
					script.onreadystatechange = null;
					script.parentNode.removeChild(script);
					script = null;
					cb();
					cb = null;
				};
				document.documentElement.appendChild(script);
			};
		}
		// Fall back to setTimeout with 0. In browsers this creates a delay of 5ms
		// or more.
		return function (cb) {
			setTimeout(cb, 0);
		};
	};

	/**
  * Helper function that is overrided to protect callbacks with entry point
  * monitor if the application monitors entry points.
  * @param {function()} callback Callback function to fire as soon as possible.
  * @return {function()} The wrapped callback.
  * @private
  */
	async.nextTick.wrapCallback_ = function (opt_returnValue) {
		return opt_returnValue;
	};

	this.metal.async = async;
}).call(this);
'use strict';

/**
 * Disposable utility. When inherited provides the `dispose` function to its
 * subclass, which is responsible for disposing of any object references
 * when an instance won't be used anymore. Subclasses should override
 * `disposeInternal` to implement any specific disposing logic.
 * @constructor
 */

(function () {
	var Disposable = function () {
		function Disposable() {
			babelHelpers.classCallCheck(this, Disposable);

			/**
    * Flag indicating if this instance has already been disposed.
    * @type {boolean}
    * @protected
    */
			this.disposed_ = false;
		}

		/**
   * Disposes of this instance's object references. Calls `disposeInternal`.
   */


		Disposable.prototype.dispose = function dispose() {
			if (!this.disposed_) {
				this.disposeInternal();
				this.disposed_ = true;
			}
		};

		/**
   * Subclasses should override this method to implement any specific
   * disposing logic (like clearing references and calling `dispose` on other
   * disposables).
   */


		Disposable.prototype.disposeInternal = function disposeInternal() {};

		/**
   * Checks if this instance has already been disposed.
   * @return {boolean}
   */


		Disposable.prototype.isDisposed = function isDisposed() {
			return this.disposed_;
		};

		return Disposable;
	}();

	this.metal.Disposable = Disposable;
}).call(this);
'use strict';

(function () {
	var object = function () {
		function object() {
			babelHelpers.classCallCheck(this, object);
		}

		/**
   * Copies all the members of a source object to a target object.
   * @param {Object} target Target object.
   * @param {...Object} var_args The objects from which values will be copied.
   * @return {Object} Returns the target object reference.
   */

		object.mixin = function mixin(target) {
			var key, source;
			for (var i = 1; i < arguments.length; i++) {
				source = arguments[i];
				for (key in source) {
					target[key] = source[key];
				}
			}
			return target;
		};

		/**
   * Returns an object based on its fully qualified external name.
   * @param {string} name The fully qualified name.
   * @param {object=} opt_obj The object within which to look; default is
   *     <code>window</code>.
   * @return {?} The value (object or primitive) or, if not found, undefined.
   */


		object.getObjectByName = function getObjectByName(name, opt_obj) {
			var scope = opt_obj || window;
			var parts = name.split('.');
			return parts.reduce(function (part, key) {
				return part[key];
			}, scope);
		};

		/**
   * Returns a new object with the same keys as the given one, but with
   * their values set to the return values of the specified function.
   * @param {!Object} obj
   * @param {!function(string, *)} fn
   * @return {!Object}
   */


		object.map = function map(obj, fn) {
			var mappedObj = {};
			var keys = Object.keys(obj);
			for (var i = 0; i < keys.length; i++) {
				mappedObj[keys[i]] = fn(keys[i], obj[keys[i]]);
			}
			return mappedObj;
		};

		return object;
	}();

	this.metal.object = object;
}).call(this);
'use strict';

(function () {
	var string = function () {
		function string() {
			babelHelpers.classCallCheck(this, string);
		}

		/**
   * Removes the breaking spaces from the left and right of the string and
   * collapses the sequences of breaking spaces in the middle into single spaces.
   * The original and the result strings render the same way in HTML.
   * @param {string} str A string in which to collapse spaces.
   * @return {string} Copy of the string with normalized breaking spaces.
   */

		string.collapseBreakingSpaces = function collapseBreakingSpaces(str) {
			return str.replace(/[\t\r\n ]+/g, ' ').replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, '');
		};

		/**
  * Returns a string with at least 64-bits of randomness.
  * @return {string} A random string, e.g. sn1s7vb4gcic.
  */


		string.getRandomString = function getRandomString() {
			var x = 2147483648;
			return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ Date.now()).toString(36);
		};

		/**
   * Calculates the hashcode for a string. The hashcode value is computed by
   * the sum algorithm: s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]. A nice
   * property of using 31 prime is that the multiplication can be replaced by
   * a shift and a subtraction for better performance: 31*i == (i<<5)-i.
   * Modern VMs do this sort of optimization automatically.
   * @param {String} val Target string.
   * @return {Number} Returns the string hashcode.
   */


		string.hashCode = function hashCode(val) {
			var hash = 0;
			for (var i = 0, len = val.length; i < len; i++) {
				hash = 31 * hash + val.charCodeAt(i);
				hash %= 0x100000000;
			}
			return hash;
		};

		/**
   * Replaces interval into the string with specified value, e.g.
   * `replaceInterval("abcde", 1, 4, "")` returns "ae".
   * @param {string} str The input string.
   * @param {Number} start Start interval position to be replaced.
   * @param {Number} end End interval position to be replaced.
   * @param {string} value The value that replaces the specified interval.
   * @return {string}
   */


		string.replaceInterval = function replaceInterval(str, start, end, value) {
			return str.substring(0, start) + value + str.substring(end);
		};

		return string;
	}();

	this.metal.string = string;
}).call(this);
'use strict';

(function () {
  var core = this.metal.core;
  var array = this.metal.array;
  var async = this.metal.async;
  var Disposable = this.metal.Disposable;
  var object = this.metal.object;
  var string = this.metal.string;
  this.metal.metal = core;
  this.metalNamed.metal = this.metalNamed.metal || {};
  this.metalNamed.metal.core = core;
  this.metalNamed.metal.array = array;
  this.metalNamed.metal.async = async;
  this.metalNamed.metal.Disposable = Disposable;
  this.metalNamed.metal.object = object;
  this.metalNamed.metal.string = string;
}).call(this);
'use strict';

/**
 * Parses the given uri string into an object.
 * @param {*=} opt_uri Optional string URI to parse
 */

(function () {
	function parseFromAnchor(opt_uri) {
		var link = document.createElement('a');
		link.href = opt_uri;
		return {
			hash: link.hash,
			hostname: link.hostname,
			password: link.password,
			pathname: link.pathname[0] === '/' ? link.pathname : '/' + link.pathname,
			port: link.port,
			protocol: link.protocol,
			search: link.search,
			username: link.username
		};
	}

	this.metal.parseFromAnchor = parseFromAnchor;
}).call(this);
'use strict';

(function () {
	var core = this.metalNamed.metal.core;
	var parseFromAnchor = this.metal.parseFromAnchor;

	/**
  * Parses the given uri string into an object. The URL function will be used
  * when present, otherwise we'll fall back to the anchor node element.
  * @param {*=} opt_uri Optional string URI to parse
  */

	function parse(opt_uri) {
		if (core.isFunction(URL) && URL.length) {
			return new URL(opt_uri);
		} else {
			return parseFromAnchor(opt_uri);
		}
	}

	this.metal.parse = parse;
}).call(this);
'use strict';

(function () {
	var Disposable = this.metalNamed.metal.Disposable;

	/**
  * A cached reference to the create function.
  */

	var create = Object.create;

	/**
  * Case insensitive string Multimap implementation. Allows multiple values for
  * the same key name.
  * @extends {Disposable}
  */

	var MultiMap = function (_Disposable) {
		babelHelpers.inherits(MultiMap, _Disposable);

		function MultiMap() {
			babelHelpers.classCallCheck(this, MultiMap);

			var _this = babelHelpers.possibleConstructorReturn(this, _Disposable.call(this));

			_this.keys = create(null);
			_this.values = create(null);
			return _this;
		}

		/**
   * Adds value to a key name.
   * @param {string} name
   * @param {*} value
   * @chainable
   */


		MultiMap.prototype.add = function add(name, value) {
			this.keys[name.toLowerCase()] = name;
			this.values[name.toLowerCase()] = this.values[name.toLowerCase()] || [];
			this.values[name.toLowerCase()].push(value);
			return this;
		};

		/**
   * Clears map names and values.
   * @chainable
   */


		MultiMap.prototype.clear = function clear() {
			this.keys = create(null);
			this.values = create(null);
			return this;
		};

		/**
   * Checks if map contains a value to the key name.
   * @param {string} name
   * @return {boolean}
   * @chainable
   */


		MultiMap.prototype.contains = function contains(name) {
			return name.toLowerCase() in this.values;
		};

		/**
   * @inheritDoc
   */


		MultiMap.prototype.disposeInternal = function disposeInternal() {
			this.values = null;
		};

		/**
   * Gets the first added value from a key name.
   * @param {string} name
   * @return {*}
   * @chainable
   */


		MultiMap.prototype.get = function get(name) {
			var values = this.values[name.toLowerCase()];
			if (values) {
				return values[0];
			}
		};

		/**
   * Gets all values from a key name.
   * @param {string} name
   * @return {Array.<*>}
   */


		MultiMap.prototype.getAll = function getAll(name) {
			return this.values[name.toLowerCase()];
		};

		/**
   * Returns true if the map is empty, false otherwise.
   * @return {boolean}
   */


		MultiMap.prototype.isEmpty = function isEmpty() {
			return this.size() === 0;
		};

		/**
   * Gets array of key names.
   * @return {Array.<string>}
   */


		MultiMap.prototype.names = function names() {
			var _this2 = this;

			return Object.keys(this.values).map(function (key) {
				return _this2.keys[key];
			});
		};

		/**
   * Removes all values from a key name.
   * @param {string} name
   * @chainable
   */


		MultiMap.prototype.remove = function remove(name) {
			delete this.keys[name.toLowerCase()];
			delete this.values[name.toLowerCase()];
			return this;
		};

		/**
   * Sets the value of a key name. Relevant to replace the current values with
   * a new one.
   * @param {string} name
   * @param {*} value
   * @chainable
   */


		MultiMap.prototype.set = function set(name, value) {
			this.keys[name.toLowerCase()] = name;
			this.values[name.toLowerCase()] = [value];
			return this;
		};

		/**
   * Gets the size of the map key names.
   * @return {number}
   */


		MultiMap.prototype.size = function size() {
			return this.names().length;
		};

		/**
   * Returns the parsed values as a string.
   * @return {string}
   */


		MultiMap.prototype.toString = function toString() {
			return JSON.stringify(this.values);
		};

		return MultiMap;
	}(Disposable);

	this.metal.MultiMap = MultiMap;
}).call(this);
'use strict';

(function () {
	var core = this.metalNamed.metal.core;
	var string = this.metalNamed.metal.string;
	var parse = this.metal.parse;
	var MultiMap = this.metal.MultiMap;


	var parseFn_ = parse;

	var Uri = function () {

		/**
   * This class contains setters and getters for the parts of the URI.
   * The following figure displays an example URIs and their component parts.
   *
   *                                  path
   *	                             ┌───┴────┐
   *	  abc://example.com:123/path/data?key=value#fragid1
   *	  └┬┘   └────┬────┘ └┬┘           └───┬───┘ └──┬──┘
   * protocol  hostname  port            search    hash
   *          └──────┬───────┘
   *                host
   *
   * @param {*=} opt_uri Optional string URI to parse
   * @constructor
   */

		function Uri() {
			var opt_uri = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
			babelHelpers.classCallCheck(this, Uri);

			this.url = Uri.parse(this.maybeAddProtocolAndHostname_(opt_uri));
		}

		/**
   * Adds parameters to uri from a <code>MultiMap</code> as source.
   * @param {MultiMap} multimap The <code>MultiMap</code> containing the
   *   parameters.
   * @protected
   * @chainable
   */


		Uri.prototype.addParametersFromMultiMap = function addParametersFromMultiMap(multimap) {
			var _this = this;

			multimap.names().forEach(function (name) {
				multimap.getAll(name).forEach(function (value) {
					_this.addParameterValue(name, value);
				});
			});
			return this;
		};

		/**
   * Adds the value of the named query parameters.
   * @param {string} key The parameter to set.
   * @param {*} value The new value. Will be explicitly casted to String.
   * @chainable
   */


		Uri.prototype.addParameterValue = function addParameterValue(name, value) {
			this.ensureQueryInitialized_();
			if (core.isDef(value)) {
				value = String(value);
			}
			this.query.add(name, value);
			return this;
		};

		/**
   * Adds the values of the named query parameter.
   * @param {string} key The parameter to set.
   * @param {*} value The new value.
   * @chainable
   */


		Uri.prototype.addParameterValues = function addParameterValues(name, values) {
			var _this2 = this;

			values.forEach(function (value) {
				return _this2.addParameterValue(name, value);
			});
			return this;
		};

		/**
   * Ensures query internal map is initialized and synced with initial value
   * extracted from URI search part.
   * @protected
   */


		Uri.prototype.ensureQueryInitialized_ = function ensureQueryInitialized_() {
			var _this3 = this;

			if (this.query) {
				return;
			}
			this.query = new MultiMap();
			var search = this.url.search;
			if (search) {
				search.substring(1).split('&').forEach(function (param) {
					var _param$split = param.split('=');

					var _param$split2 = babelHelpers.slicedToArray(_param$split, 2);

					var key = _param$split2[0];
					var value = _param$split2[1];

					if (core.isDef(value)) {
						value = Uri.urlDecode(value);
					}
					_this3.addParameterValue(key, value);
				});
			}
		};

		/**
   * Gets the hash part of uri.
   * @return {string}
   */


		Uri.prototype.getHash = function getHash() {
			return this.url.hash || '';
		};

		/**
   * Gets the host part of uri. E.g. <code>[hostname]:[port]</code>.
   * @return {string}
   */


		Uri.prototype.getHost = function getHost() {
			var host = this.getHostname();
			if (host) {
				var port = this.getPort();
				if (port && port !== '80') {
					host += ':' + port;
				}
			}
			return host;
		};

		/**
   * Gets the hostname part of uri without protocol and port.
   * @return {string}
   */


		Uri.prototype.getHostname = function getHostname() {
			var hostname = this.url.hostname;
			if (hostname === Uri.HOSTNAME_PLACEHOLDER) {
				return '';
			}
			return hostname;
		};

		/**
   * Gets the origin part of uri. E.g. <code>http://[hostname]:[port]</code>.
   * @return {string}
   */


		Uri.prototype.getOrigin = function getOrigin() {
			var host = this.getHost();
			if (host) {
				return this.getProtocol() + '//' + host;
			}
			return '';
		};

		/**
   * Returns the first value for a given parameter or undefined if the given
   * parameter name does not appear in the query string.
   * @param {string} paramName Unescaped parameter name.
   * @return {string|undefined} The first value for a given parameter or
   *   undefined if the given parameter name does not appear in the query
   *   string.
   */


		Uri.prototype.getParameterValue = function getParameterValue(name) {
			this.ensureQueryInitialized_();
			return this.query.get(name);
		};

		/**
   * Returns the value<b>s</b> for a given parameter as a list of decoded
   * query parameter values.
   * @param {string} name The parameter to get values for.
   * @return {!Array<?>} The values for a given parameter as a list of decoded
   *   query parameter values.
   */


		Uri.prototype.getParameterValues = function getParameterValues(name) {
			this.ensureQueryInitialized_();
			return this.query.getAll(name);
		};

		/**
   * Returns the name<b>s</b> of the parameters.
   * @return {!Array<string>} The names for the parameters as a list of
   *   strings.
   */


		Uri.prototype.getParameterNames = function getParameterNames() {
			this.ensureQueryInitialized_();
			return this.query.names();
		};

		/**
   * Gets the function currently being used to parse URIs.
   * @return {!function()}
   */


		Uri.getParseFn = function getParseFn() {
			return parseFn_;
		};

		/**
   * Gets the pathname part of uri.
   * @return {string}
   */


		Uri.prototype.getPathname = function getPathname() {
			return this.url.pathname;
		};

		/**
   * Gets the port number part of uri as string.
   * @return {string}
   */


		Uri.prototype.getPort = function getPort() {
			return this.url.port;
		};

		/**
   * Gets the protocol part of uri. E.g. <code>http:</code>.
   * @return {string}
   */


		Uri.prototype.getProtocol = function getProtocol() {
			return this.url.protocol;
		};

		/**
   * Gets the search part of uri. Search value is retrieved from query
   * parameters.
   * @return {string}
   */


		Uri.prototype.getSearch = function getSearch() {
			var _this4 = this;

			var search = '';
			var querystring = '';
			this.getParameterNames().forEach(function (name) {
				_this4.getParameterValues(name).forEach(function (value) {
					querystring += name;
					if (core.isDef(value)) {
						querystring += '=' + encodeURIComponent(value);
					}
					querystring += '&';
				});
			});
			querystring = querystring.slice(0, -1);
			if (querystring) {
				search += '?' + querystring;
			}
			return search;
		};

		/**
   * Checks if uri contains the parameter.
   * @param {string} name
   * @return {boolean}
   */


		Uri.prototype.hasParameter = function hasParameter(name) {
			this.ensureQueryInitialized_();
			return this.query.contains(name);
		};

		/**
   * Makes this URL unique by adding a random param to it. Useful for avoiding
   * cache.
   */


		Uri.prototype.makeUnique = function makeUnique() {
			this.setParameterValue(Uri.RANDOM_PARAM, string.getRandomString());
			return this;
		};

		/**
   * Maybe adds protocol and a hostname placeholder on a parial URI if needed.
   * Relevent for compatibility with <code>URL</code> native object.
   * @param {string=} opt_uri
   * @return {string} URI with protocol and hostname placeholder.
   */


		Uri.prototype.maybeAddProtocolAndHostname_ = function maybeAddProtocolAndHostname_(opt_uri) {
			var url = opt_uri;
			if (opt_uri.indexOf('://') === -1 && opt_uri.indexOf('javascript:') !== 0) {
				// jshint ignore:line

				url = Uri.DEFAULT_PROTOCOL;
				if (opt_uri[0] !== '/' || opt_uri[1] !== '/') {
					url += '//';
				}

				switch (opt_uri.charAt(0)) {
					case '.':
					case '?':
					case '#':
						url += Uri.HOSTNAME_PLACEHOLDER;
						url += '/';
						url += opt_uri;
						break;
					case '':
					case '/':
						if (opt_uri[1] !== '/') {
							url += Uri.HOSTNAME_PLACEHOLDER;
						}
						url += opt_uri;
						break;
					default:
						url += opt_uri;
				}
			}
			return url;
		};

		/**
   * Normalizes the parsed object to be in the expected standard.
   * @param {!Object}
   */


		Uri.normalizeObject = function normalizeObject(parsed) {
			var length = parsed.pathname ? parsed.pathname.length : 0;
			if (length > 1 && parsed.pathname[length - 1] === '/') {
				parsed.pathname = parsed.pathname.substr(0, length - 1);
			}
			return parsed;
		};

		/**
   * Parses the given uri string into an object.
   * @param {*=} opt_uri Optional string URI to parse
   */


		Uri.parse = function parse(opt_uri) {
			return Uri.normalizeObject(parseFn_(opt_uri));
		};

		/**
   * Removes the named query parameter.
   * @param {string} name The parameter to remove.
   * @chainable
   */


		Uri.prototype.removeParameter = function removeParameter(name) {
			this.ensureQueryInitialized_();
			this.query.remove(name);
			return this;
		};

		/**
   * Removes uniqueness parameter of the uri.
   * @chainable
   */


		Uri.prototype.removeUnique = function removeUnique() {
			this.removeParameter(Uri.RANDOM_PARAM);
			return this;
		};

		/**
   * Sets the hash.
   * @param {string} hash
   * @chainable
   */


		Uri.prototype.setHash = function setHash(hash) {
			this.url.hash = hash;
			return this;
		};

		/**
   * Sets the hostname.
   * @param {string} hostname
   * @chainable
   */


		Uri.prototype.setHostname = function setHostname(hostname) {
			this.url.hostname = hostname;
			return this;
		};

		/**
   * Sets the value of the named query parameters, clearing previous values
   * for that key.
   * @param {string} key The parameter to set.
   * @param {*} value The new value.
   * @chainable
   */


		Uri.prototype.setParameterValue = function setParameterValue(name, value) {
			this.removeParameter(name);
			this.addParameterValue(name, value);
			return this;
		};

		/**
   * Sets the values of the named query parameters, clearing previous values
   * for that key.
   * @param {string} key The parameter to set.
   * @param {*} value The new value.
   * @chainable
   */


		Uri.prototype.setParameterValues = function setParameterValues(name, values) {
			var _this5 = this;

			this.removeParameter(name);
			values.forEach(function (value) {
				return _this5.addParameterValue(name, value);
			});
			return this;
		};

		/**
   * Sets the pathname.
   * @param {string} pathname
   * @chainable
   */


		Uri.prototype.setPathname = function setPathname(pathname) {
			this.url.pathname = pathname;
			return this;
		};

		/**
   * Sets the port number.
   * @param {*} port Port number.
   * @chainable
   */


		Uri.prototype.setPort = function setPort(port) {
			this.url.port = port;
			return this;
		};

		/**
   * Sets the function that will be used for parsing the original string uri
   * into an object.
   * @param {!function()} parseFn
   */


		Uri.setParseFn = function setParseFn(parseFn) {
			parseFn_ = parseFn;
		};

		/**
   * Sets the protocol. If missing <code>http:</code> is used as default.
   * @param {string} protocol
   * @chainable
   */


		Uri.prototype.setProtocol = function setProtocol(protocol) {
			this.url.protocol = protocol;
			if (this.url.protocol[this.url.protocol.length - 1] !== ':') {
				this.url.protocol += ':';
			}
			return this;
		};

		/**
   * @return {string} The string form of the url.
   * @override
   */


		Uri.prototype.toString = function toString() {
			var href = '';
			var host = this.getHost();
			if (host) {
				href += this.getProtocol() + '//';
			}
			href += host + this.getPathname() + this.getSearch() + this.getHash();
			return href;
		};

		/**
   * Joins the given paths.
   * @param {string} basePath
   * @param {...string} ...paths Any number of paths to be joined with the base url.
   * @static
   */


		Uri.joinPaths = function joinPaths(basePath) {
			for (var _len = arguments.length, paths = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				paths[_key - 1] = arguments[_key];
			}

			if (basePath.charAt(basePath.length - 1) === '/') {
				basePath = basePath.substring(0, basePath.length - 1);
			}
			paths = paths.map(function (path) {
				return path.charAt(0) === '/' ? path.substring(1) : path;
			});
			return [basePath].concat(paths).join('/').replace(/\/$/, '');
		};

		/**
   * URL-decodes the string. We need to specially handle '+'s because
   * the javascript library doesn't convert them to spaces.
   * @param {string} str The string to url decode.
   * @return {string} The decoded {@code str}.
   */


		Uri.urlDecode = function urlDecode(str) {
			return decodeURIComponent(str.replace(/\+/g, ' '));
		};

		return Uri;
	}();

	/**
  * Default protocol value.
  * @type {string}
  * @default http:
  * @static
  */


	Uri.DEFAULT_PROTOCOL = 'http:';

	/**
  * Hostname placeholder. Relevant to internal usage only.
  * @type {string}
  * @static
  */
	Uri.HOSTNAME_PLACEHOLDER = 'hostname' + Date.now();

	/**
  * Name used by the param generated by `makeUnique`.
  * @type {string}
  * @static
  */
	Uri.RANDOM_PARAM = 'zx';

	this.metal.Uri = Uri;
}).call(this);
}).call(this);
//# sourceMappingURL=uri.js.map
