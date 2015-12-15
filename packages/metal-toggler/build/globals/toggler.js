(function() {
this.metal = this.metal || {};
this.metalNamed = this.metalNamed || {};
var babelHelpers = {};

babelHelpers.typeof = function (obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
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

babelHelpers;
'use strict';

/**
 * A collection of core utility functions.
 * @const
 */

(function () {
	var core = (function () {
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
	})();

	/**
  * Unique id property prefix.
  * @type {String}
  * @protected
  */

	core.UID_PROPERTY = 'core_' + Date.now() % 1e9 + '' + (Math.random() * 1e9 >>> 0);

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

	var object = (function () {
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
   * @return {?} The value (object or primitive) or, if not found, null.
   */

		object.getObjectByName = function getObjectByName(name, opt_obj) {
			var parts = name.split('.');
			var cur = opt_obj || window;
			var part;
			while (part = parts.shift()) {
				if (core.isDefAndNotNull(cur[part])) {
					cur = cur[part];
				} else {
					return null;
				}
			}
			return cur;
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
	})();

	this.metal.object = object;
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
	var Disposable = (function () {
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
	})();

	this.metal.Disposable = Disposable;
}).call(this);
'use strict';

(function () {
	var Disposable = this.metal.Disposable;

	/**
  * EventHandle utility. Holds information about an event subscription, and
  * allows removing them easily.
  * EventHandle is a Disposable, but it's important to note that the
  * EventEmitter that created it is not the one responsible for disposing it.
  * That responsibility is for the code that holds a reference to it.
  * @param {!EventEmitter} emitter Emitter the event was subscribed to.
  * @param {string} event The name of the event that was subscribed to.
  * @param {!Function} listener The listener subscribed to the event.
  * @constructor
  * @extends {Disposable}
  */

	var EventHandle = (function (_Disposable) {
		babelHelpers.inherits(EventHandle, _Disposable);

		function EventHandle(emitter, event, listener) {
			babelHelpers.classCallCheck(this, EventHandle);

			/**
    * The EventEmitter instance that the event was subscribed to.
    * @type {EventEmitter}
    * @protected
    */

			var _this = babelHelpers.possibleConstructorReturn(this, _Disposable.call(this));

			_this.emitter_ = emitter;

			/**
    * The name of the event that was subscribed to.
    * @type {string}
    * @protected
    */
			_this.event_ = event;

			/**
    * The listener subscribed to the event.
    * @type {Function}
    * @protected
    */
			_this.listener_ = listener;
			return _this;
		}

		/**
   * Disposes of this instance's object references.
   * @override
   */

		EventHandle.prototype.disposeInternal = function disposeInternal() {
			this.removeListener();
			this.emitter_ = null;
			this.listener_ = null;
		};

		/**
   * Removes the listener subscription from the emitter.
   */

		EventHandle.prototype.removeListener = function removeListener() {
			if (!this.emitter_.isDisposed()) {
				this.emitter_.removeListener(this.event_, this.listener_);
			}
		};

		return EventHandle;
	})(Disposable);

	EventHandle.prototype.registerMetalComponent && EventHandle.prototype.registerMetalComponent(EventHandle, 'EventHandle')
	this.metal.EventHandle = EventHandle;
}).call(this);
'use strict';

(function () {
	var EventHandle = this.metal.EventHandle;

	/**
  * This is a special EventHandle, that is responsible for dom events, instead
  * of EventEmitter events.
  * @extends {EventHandle}
  */

	var DomEventHandle = (function (_EventHandle) {
		babelHelpers.inherits(DomEventHandle, _EventHandle);

		/**
   * The constructor for `DomEventHandle`.
   * @param {!EventEmitter} emitter Emitter the event was subscribed to.
   * @param {string} event The name of the event that was subscribed to.
   * @param {!Function} listener The listener subscribed to the event.
   * @param {boolean} opt_capture Flag indicating if listener should be triggered
   *   during capture phase, instead of during the bubbling phase. Defaults to false.
   * @constructor
   */

		function DomEventHandle(emitter, event, listener, opt_capture) {
			babelHelpers.classCallCheck(this, DomEventHandle);

			var _this = babelHelpers.possibleConstructorReturn(this, _EventHandle.call(this, emitter, event, listener));

			_this.capture_ = opt_capture;
			return _this;
		}

		/**
   * @inheritDoc
   */

		DomEventHandle.prototype.removeListener = function removeListener() {
			this.emitter_.removeEventListener(this.event_, this.listener_, this.capture_);
		};

		return DomEventHandle;
	})(EventHandle);

	DomEventHandle.prototype.registerMetalComponent && DomEventHandle.prototype.registerMetalComponent(DomEventHandle, 'DomEventHandle')
	this.metal.DomEventHandle = DomEventHandle;
}).call(this);
'use strict';

(function () {
	var core = this.metal.core;
	var object = this.metal.object;
	var DomEventHandle = this.metal.DomEventHandle;

	var dom = (function () {
		function dom() {
			babelHelpers.classCallCheck(this, dom);
		}

		/**
   * Adds the requested CSS classes to an element.
   * @param {!Element} element The element to add CSS classes to.
   * @param {string} classes CSS classes to add.
   */

		dom.addClasses = function addClasses(element, classes) {
			if (!core.isObject(element) || !core.isString(classes)) {
				return;
			}

			if ('classList' in element) {
				dom.addClassesWithNative_(element, classes);
			} else {
				dom.addClassesWithoutNative_(element, classes);
			}
		};

		/**
   * Adds the requested CSS classes to an element using classList.
   * @param {!Element} element The element to add CSS classes to.
   * @param {string} classes CSS classes to add.
   * @protected
   */

		dom.addClassesWithNative_ = function addClassesWithNative_(element, classes) {
			classes.split(' ').forEach(function (className) {
				element.classList.add(className);
			});
		};

		/**
   * Adds the requested CSS classes to an element without using classList.
   * @param {!Element} element The element to add CSS classes to.
   * @param {string} classes CSS classes to add.
   * @protected
   */

		dom.addClassesWithoutNative_ = function addClassesWithoutNative_(element, classes) {
			var elementClassName = ' ' + element.className + ' ';
			var classesToAppend = '';

			classes = classes.split(' ');

			for (var i = 0; i < classes.length; i++) {
				var className = classes[i];

				if (elementClassName.indexOf(' ' + className + ' ') === -1) {
					classesToAppend += ' ' + className;
				}
			}

			if (classesToAppend) {
				element.className = element.className + classesToAppend;
			}
		};

		/**
   * Appends a child node with text or other nodes to a parent node. If
   * child is a HTML string it will be automatically converted to a document
   * fragment before appending it to the parent.
   * @param {!Element} parent The node to append nodes to.
   * @param {!(Element|NodeList|string)} child The thing to append to the parent.
   * @return {!Element} The appended child.
   */

		dom.append = function append(parent, child) {
			if (core.isString(child)) {
				child = dom.buildFragment(child);
			}
			if (child instanceof NodeList) {
				var childArr = Array.prototype.slice.call(child);
				for (var i = 0; i < childArr.length; i++) {
					parent.appendChild(childArr[i]);
				}
			} else {
				parent.appendChild(child);
			}
			return child;
		};

		/**
   * Helper for converting a HTML string into a document fragment.
   * @param {string} htmlString The HTML string to convert.
   * @return {!Element} The resulting document fragment.
   */

		dom.buildFragment = function buildFragment(htmlString) {
			var tempDiv = document.createElement('div');
			tempDiv.innerHTML = '<br>' + htmlString;
			tempDiv.removeChild(tempDiv.firstChild);

			var fragment = document.createDocumentFragment();
			while (tempDiv.firstChild) {
				fragment.appendChild(tempDiv.firstChild);
			}
			return fragment;
		};

		/**
   * Checks if the first element contains the second one.
   * @param {!Element} element1
   * @param {!Element} element2
   * @return {boolean}
   */

		dom.contains = function contains(element1, element2) {
			if (core.isDocument(element1)) {
				// document.contains is not defined on IE9, so call it on documentElement instead.
				return element1.documentElement.contains(element2);
			} else {
				return element1.contains(element2);
			}
		};

		/**
   * Listens to the specified event on the given DOM element, but only calls the
   * callback with the event when it triggered by elements that match the given
   * selector.
   * @param {!Element} element The container DOM element to listen to the event on.
   * @param {string} eventName The name of the event to listen to.
   * @param {string} selector The selector that matches the child elements that
   *   the event should be triggered for.
   * @param {!function(!Object)} callback Function to be called when the event is
   *   triggered. It will receive the normalized event object.
   * @return {!DomEventHandle} Can be used to remove the listener.
   */

		dom.delegate = function delegate(element, eventName, selector, callback) {
			var customConfig = dom.customEvents[eventName];
			if (customConfig && customConfig.delegate) {
				eventName = customConfig.originalEvent;
				callback = customConfig.handler.bind(customConfig, callback);
			}
			return dom.on(element, eventName, dom.handleDelegateEvent_.bind(null, selector, callback));
		};

		/**
   * Inserts node in document as last element.
   * @param {Element} node Element to remove children from.
   */

		dom.enterDocument = function enterDocument(node) {
			dom.append(document.body, node);
		};

		/**
   * Removes node from document.
   * @param {Element} node Element to remove children from.
   */

		dom.exitDocument = function exitDocument(node) {
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		};

		/**
   * This is called when an event is triggered by a delegate listener (see
   * `dom.delegate` for more details).
   * @param {string} selector The selector or element that matches the child
   *   elements that the event should be triggered for.
   * @param {!function(!Object)} callback Function to be called when the event
   *   is triggered. It will receive the normalized event object.
   * @param {!Event} event The event payload.
   * @return {boolean} False if at least one of the triggered callbacks returns
   *   false, or true otherwise.
   */

		dom.handleDelegateEvent_ = function handleDelegateEvent_(selector, callback, event) {
			dom.normalizeDelegateEvent_(event);

			var currentElement = event.target;
			var returnValue = true;

			while (currentElement && !event.stopped) {
				if (core.isString(selector) && dom.match(currentElement, selector)) {
					event.delegateTarget = currentElement;
					returnValue &= callback(event);
				}
				if (currentElement === event.currentTarget) {
					break;
				}
				currentElement = currentElement.parentNode;
			}
			event.delegateTarget = null;

			return returnValue;
		};

		/**
   * Checks if the given element has the requested css class.
   * @param {!Element} element
   * @param {string} className
   * @return {boolean}
   */

		dom.hasClass = function hasClass(element, className) {
			if ('classList' in element) {
				return dom.hasClassWithNative_(element, className);
			} else {
				return dom.hasClassWithoutNative_(element, className);
			}
		};

		/**
   * Checks if the given element has the requested css class using classList.
   * @param {!Element} element
   * @param {string} className
   * @return {boolean}
   * @protected
   */

		dom.hasClassWithNative_ = function hasClassWithNative_(element, className) {
			return element.classList.contains(className);
		};

		/**
   * Checks if the given element has the requested css class without using classList.
   * @param {!Element} element
   * @param {string} className
   * @return {boolean}
   * @protected
   */

		dom.hasClassWithoutNative_ = function hasClassWithoutNative_(element, className) {
			return (' ' + element.className + ' ').indexOf(' ' + className + ' ') >= 0;
		};

		/**
   * Checks if the given element is empty or not.
   * @param {!Element} element
   * @return {boolean}
   */

		dom.isEmpty = function isEmpty(element) {
			return element.childNodes.length === 0;
		};

		/**
   * Check if an element matches a given selector.
   * @param {Element} element
   * @param {string} selector
   * @return {boolean}
   */

		dom.match = function match(element, selector) {
			if (!element || element.nodeType !== 1) {
				return false;
			}

			var p = Element.prototype;
			var m = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector;
			if (m) {
				return m.call(element, selector);
			}

			return dom.matchFallback_(element, selector);
		};

		/**
   * Check if an element matches a given selector, using an internal implementation
   * instead of calling existing javascript functions.
   * @param {Element} element
   * @param {string} selector
   * @return {boolean}
   * @protected
   */

		dom.matchFallback_ = function matchFallback_(element, selector) {
			var nodes = document.querySelectorAll(selector, element.parentNode);
			for (var i = 0; i < nodes.length; ++i) {
				if (nodes[i] === element) {
					return true;
				}
			}
			return false;
		};

		/**
   * Returns the next sibling of the given element that matches the specified
   * selector, or null if there is none.
   * @param {!Element} element
   * @param {?string} selector
   */

		dom.next = function next(element, selector) {
			do {
				element = element.nextSibling;
				if (element && dom.match(element, selector)) {
					return element;
				}
			} while (element);
			return null;
		};

		/**
   * Normalizes the event payload for delegate listeners.
   * @param {!Event} event
   */

		dom.normalizeDelegateEvent_ = function normalizeDelegateEvent_(event) {
			event.stopPropagation = dom.stopPropagation_;
			event.stopImmediatePropagation = dom.stopImmediatePropagation_;
		};

		/**
   * Listens to the specified event on the given DOM element. This function normalizes
   * DOM event payloads and functions so they'll work the same way on all supported
   * browsers.
   * @param {!Element|string} element The DOM element to listen to the event on, or
   *   a selector that should be delegated on the entire document.
   * @param {string} eventName The name of the event to listen to.
   * @param {!function(!Object)} callback Function to be called when the event is
   *   triggered. It will receive the normalized event object.
   * @param {boolean} opt_capture Flag indicating if listener should be triggered
   *   during capture phase, instead of during the bubbling phase. Defaults to false.
   * @return {!DomEventHandle} Can be used to remove the listener.
   */

		dom.on = function on(element, eventName, callback, opt_capture) {
			if (core.isString(element)) {
				return dom.delegate(document, eventName, element, callback);
			}
			var customConfig = dom.customEvents[eventName];
			if (customConfig && customConfig.event) {
				eventName = customConfig.originalEvent;
				callback = customConfig.handler.bind(customConfig, callback);
			}
			element.addEventListener(eventName, callback, opt_capture);
			return new DomEventHandle(element, eventName, callback, opt_capture);
		};

		/**
   * Listens to the specified event on the given DOM element once. This
   * function normalizes DOM event payloads and functions so they'll work the
   * same way on all supported browsers.
   * @param {!Element} element The DOM element to listen to the event on.
   * @param {string} eventName The name of the event to listen to.
   * @param {!function(!Object)} callback Function to be called when the event
   *   is triggered. It will receive the normalized event object.
   * @return {!DomEventHandle} Can be used to remove the listener.
   */

		dom.once = function once(element, eventName, callback) {
			var domEventHandle = this.on(element, eventName, function () {
				domEventHandle.removeListener();
				return callback.apply(this, arguments);
			});
			return domEventHandle;
		};

		/**
   * Registers a custom event.
   * @param {string} eventName The name of the custom event.
   * @param {!Object} customConfig An object with information about how the event
   *   should be handled.
   */

		dom.registerCustomEvent = function registerCustomEvent(eventName, customConfig) {
			dom.customEvents[eventName] = customConfig;
		};

		/**
   * Removes all the child nodes on a DOM node.
   * @param {Element} node Element to remove children from.
   */

		dom.removeChildren = function removeChildren(node) {
			var child;
			while (child = node.firstChild) {
				node.removeChild(child);
			}
		};

		/**
   * Removes the requested CSS classes from an element.
   * @param {!Element} element The element to remove CSS classes from.
   * @param {string} classes CSS classes to remove.
   */

		dom.removeClasses = function removeClasses(element, classes) {
			if (!core.isObject(element) || !core.isString(classes)) {
				return;
			}

			if ('classList' in element) {
				dom.removeClassesWithNative_(element, classes);
			} else {
				dom.removeClassesWithoutNative_(element, classes);
			}
		};

		/**
   * Removes the requested CSS classes from an element using classList.
   * @param {!Element} element The element to remove CSS classes from.
   * @param {string} classes CSS classes to remove.
   * @protected
   */

		dom.removeClassesWithNative_ = function removeClassesWithNative_(element, classes) {
			classes.split(' ').forEach(function (className) {
				element.classList.remove(className);
			});
		};

		/**
   * Removes the requested CSS classes from an element without using classList.
   * @param {!Element} element The element to remove CSS classes from.
   * @param {string} classes CSS classes to remove.
   * @protected
   */

		dom.removeClassesWithoutNative_ = function removeClassesWithoutNative_(element, classes) {
			var elementClassName = ' ' + element.className + ' ';

			classes = classes.split(' ');

			for (var i = 0; i < classes.length; i++) {
				elementClassName = elementClassName.replace(' ' + classes[i] + ' ', ' ');
			}

			element.className = elementClassName.trim();
		};

		/**
   * Replaces the first element with the second.
   * @param {Element} element1
   * @param {Element} element2
   */

		dom.replace = function replace(element1, element2) {
			if (element1 && element2 && element1 !== element2 && element1.parentNode) {
				element1.parentNode.insertBefore(element2, element1);
				element1.parentNode.removeChild(element1);
			}
		};

		/**
   * The function that replaces `stopImmediatePropagation_` for events.
   * @protected
   */

		dom.stopImmediatePropagation_ = function stopImmediatePropagation_() {
			this.stopped = true;
			Event.prototype.stopImmediatePropagation.call(this);
		};

		/**
   * The function that replaces `stopPropagation` for events.
   * @protected
   */

		dom.stopPropagation_ = function stopPropagation_() {
			this.stopped = true;
			Event.prototype.stopPropagation.call(this);
		};

		/**
   * Checks if the given element supports the given event type.
   * @param {!Element|string} element The DOM element or element tag name to check.
   * @param {string} eventName The name of the event to check.
   * @return {boolean}
   */

		dom.supportsEvent = function supportsEvent(element, eventName) {
			if (dom.customEvents[eventName]) {
				return true;
			}

			if (core.isString(element)) {
				if (!elementsByTag[element]) {
					elementsByTag[element] = document.createElement(element);
				}
				element = elementsByTag[element];
			}
			return 'on' + eventName in element;
		};

		/**
   * Converts the given argument to a DOM element. Strings are assumed to
   * be selectors, and so a matched element will be returned. If the arg
   * is already a DOM element it will be the return value.
   * @param {string|Element|Document} selectorOrElement
   * @return {Element} The converted element, or null if none was found.
   */

		dom.toElement = function toElement(selectorOrElement) {
			if (core.isElement(selectorOrElement) || core.isDocument(selectorOrElement)) {
				return selectorOrElement;
			} else if (core.isString(selectorOrElement)) {
				if (selectorOrElement[0] === '#' && selectorOrElement.indexOf(' ') === -1) {
					return document.getElementById(selectorOrElement.substr(1));
				} else {
					return document.querySelector(selectorOrElement);
				}
			} else {
				return null;
			}
		};

		/**
   * Adds or removes one or more classes from an element. If any of the classes
   * is present, it will be removed from the element, or added otherwise.
   * @param {!Element} element The element which classes will be toggled.
   * @param {string} classes The classes which have to added or removed from the element.
   */

		dom.toggleClasses = function toggleClasses(element, classes) {
			if (!core.isObject(element) || !core.isString(classes)) {
				return;
			}

			if ('classList' in element) {
				dom.toggleClassesWithNative_(element, classes);
			} else {
				dom.toggleClassesWithoutNative_(element, classes);
			}
		};

		/**
   * Adds or removes one or more classes from an element using classList.
   * If any of the classes is present, it will be removed from the element,
   * or added otherwise.
   * @param {!Element} element The element which classes will be toggled.
   * @param {string} classes The classes which have to added or removed from the element.
   */

		dom.toggleClassesWithNative_ = function toggleClassesWithNative_(element, classes) {
			classes.split(' ').forEach(function (className) {
				element.classList.toggle(className);
			});
		};

		/**
   * Adds or removes one or more classes from an element without using classList.
   * If any of the classes is present, it will be removed from the element,
   * or added otherwise.
   * @param {!Element} element The element which classes will be toggled.
   * @param {string} classes The classes which have to added or removed from the element.
   */

		dom.toggleClassesWithoutNative_ = function toggleClassesWithoutNative_(element, classes) {
			var elementClassName = ' ' + element.className + ' ';

			classes = classes.split(' ');

			for (var i = 0; i < classes.length; i++) {
				var className = ' ' + classes[i] + ' ';
				var classIndex = elementClassName.indexOf(className);

				if (classIndex === -1) {
					elementClassName = elementClassName + classes[i] + ' ';
				} else {
					elementClassName = elementClassName.substring(0, classIndex) + ' ' + elementClassName.substring(classIndex + className.length);
				}
			}

			element.className = elementClassName.trim();
		};

		/**
   * Triggers the specified event on the given element.
   * NOTE: This should mostly be used for testing, not on real code.
   * @param {!Element} element The node that should trigger the event.
   * @param {string} eventName The name of the event to be triggred.
   * @param {Object=} opt_eventObj An object with data that should be on the
   *   triggered event's payload.
   */

		dom.triggerEvent = function triggerEvent(element, eventName, opt_eventObj) {
			var eventObj = document.createEvent('HTMLEvents');
			eventObj.initEvent(eventName, true, true);
			object.mixin(eventObj, opt_eventObj);
			element.dispatchEvent(eventObj);
		};

		return dom;
	})();

	var elementsByTag = {};
	dom.customEvents = {};

	this.metal.dom = dom;
}).call(this);
'use strict';

(function () {
	var core = this.metal.core;

	var array = (function () {
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
			for (var i = 0; i < arr1.length; i++) {
				if (arr1[i] !== arr2[i]) {
					return false;
				}
			}
			return arr1.length === arr2.length;
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
	})();

	this.metal.array = array;
}).call(this);
'use strict';

(function () {
	var core = this.metal.core;
	var array = this.metal.array;
	var Disposable = this.metal.Disposable;
	var EventHandle = this.metal.EventHandle;

	/**
  * EventEmitter utility.
  * @constructor
  * @extends {Disposable}
  */

	var EventEmitter = (function (_Disposable) {
		babelHelpers.inherits(EventEmitter, _Disposable);

		function EventEmitter() {
			babelHelpers.classCallCheck(this, EventEmitter);

			/**
    * Holds event listeners scoped by event type.
    * @type {!Object<string, !Array<!function()>>}
    * @protected
    */

			var _this = babelHelpers.possibleConstructorReturn(this, _Disposable.call(this));

			_this.events_ = [];

			/**
    * The maximum number of listeners allowed for each event type. If the number
    * becomes higher than the max, a warning will be issued.
    * @type {number}
    * @protected
    */
			_this.maxListeners_ = 10;

			/**
    * Configuration option which determines if an event facade should be sent
    * as a param of listeners when emitting events. If set to true, the facade
    * will be passed as the first argument of the listener.
    * @type {boolean}
    * @protected
    */
			_this.shouldUseFacade_ = false;
			return _this;
		}

		/**
   * Adds a listener to the end of the listeners array for the specified events.
   * @param {!(Array|string)} events
   * @param {!Function} listener
   * @param {boolean} opt_default Flag indicating if this listener is a default
   *   action for this event. Default actions are run last, and only if no previous
   *   listener call `preventDefault()` on the received event facade.
   * @return {!EventHandle} Can be used to remove the listener.
   */

		EventEmitter.prototype.addListener = function addListener(events, listener, opt_default) {
			this.validateListener_(listener);

			events = this.normalizeEvents_(events);
			for (var i = 0; i < events.length; i++) {
				this.addSingleListener_(events[i], listener, opt_default);
			}

			return new EventHandle(this, events, listener);
		};

		/**
   * Adds a listener to the end of the listeners array for a single event.
   * @param {string} event
   * @param {!Function} listener
   * @param {boolean} opt_default Flag indicating if this listener is a default
   *   action for this event. Default actions are run last, and only if no previous
   *   listener call `preventDefault()` on the received event facade.
   * @return {!EventHandle} Can be used to remove the listener.
   * @param {Function=} opt_origin The original function that was added as a
   *   listener, if there is any.
   * @protected
   */

		EventEmitter.prototype.addSingleListener_ = function addSingleListener_(event, listener, opt_default, opt_origin) {
			this.emit('newListener', event, listener);

			if (!this.events_[event]) {
				this.events_[event] = [];
			}
			this.events_[event].push({
				default: opt_default,
				fn: listener,
				origin: opt_origin
			});

			var listeners = this.events_[event];
			if (listeners.length > this.maxListeners_ && !listeners.warned) {
				console.warn('Possible EventEmitter memory leak detected. %d listeners added ' + 'for event %s. Use emitter.setMaxListeners() to increase limit.', listeners.length, event);
				listeners.warned = true;
			}
		};

		/**
   * Disposes of this instance's object references.
   * @override
   */

		EventEmitter.prototype.disposeInternal = function disposeInternal() {
			this.events_ = [];
		};

		/**
   * Execute each of the listeners in order with the supplied arguments.
   * @param {string} event
   * @param {*} opt_args [arg1], [arg2], [...]
   * @return {boolean} Returns true if event had listeners, false otherwise.
   */

		EventEmitter.prototype.emit = function emit(event) {
			var args = array.slice(arguments, 1);
			var listeners = (this.events_[event] || []).concat();

			var facade;
			if (this.getShouldUseFacade()) {
				facade = {
					preventDefault: function preventDefault() {
						facade.preventedDefault = true;
					},
					target: this,
					type: event
				};
				args.push(facade);
			}

			var defaultListeners = [];
			for (var i = 0; i < listeners.length; i++) {
				if (listeners[i].default) {
					defaultListeners.push(listeners[i]);
				} else {
					listeners[i].fn.apply(this, args);
				}
			}
			if (!facade || !facade.preventedDefault) {
				for (var j = 0; j < defaultListeners.length; j++) {
					defaultListeners[j].fn.apply(this, args);
				}
			}

			if (event !== '*') {
				this.emit.apply(this, ['*', event].concat(args));
			}

			return listeners.length > 0;
		};

		/**
   * Gets the configuration option which determines if an event facade should
   * be sent as a param of listeners when emitting events. If set to true, the
   * facade will be passed as the first argument of the listener.
   * @return {boolean}
   */

		EventEmitter.prototype.getShouldUseFacade = function getShouldUseFacade() {
			return this.shouldUseFacade_;
		};

		/**
   * Returns an array of listeners for the specified event.
   * @param {string} event
   * @return {Array} Array of listeners.
   */

		EventEmitter.prototype.listeners = function listeners(event) {
			return (this.events_[event] || []).map(function (listener) {
				return listener.fn;
			});
		};

		/**
   * Adds a listener that will be invoked a fixed number of times for the
   * events. After each event is triggered the specified amount of times, the
   * listener is removed for it.
   * @param {!(Array|string)} events
   * @param {number} amount The amount of times this event should be listened
   * to.
   * @param {!Function} listener
   * @return {!EventHandle} Can be used to remove the listener.
   */

		EventEmitter.prototype.many = function many(events, amount, listener) {
			events = this.normalizeEvents_(events);
			for (var i = 0; i < events.length; i++) {
				this.many_(events[i], amount, listener);
			}

			return new EventHandle(this, events, listener);
		};

		/**
   * Adds a listener that will be invoked a fixed number of times for a single
   * event. After the event is triggered the specified amount of times, the
   * listener is removed.
   * @param {string} event
   * @param {number} amount The amount of times this event should be listened
   * to.
   * @param {!Function} listener
   * @protected
   */

		EventEmitter.prototype.many_ = function many_(event, amount, listener) {
			var self = this;

			if (amount <= 0) {
				return;
			}

			function handlerInternal() {
				if (--amount === 0) {
					self.removeListener(event, handlerInternal);
				}
				listener.apply(self, arguments);
			}

			self.addSingleListener_(event, handlerInternal, false, listener);
		};

		/**
   * Checks if a listener object matches the given listener function. To match,
   * it needs to either point to that listener or have it as its origin.
   * @param {!Object} listenerObj
   * @param {!Function} listener
   * @return {boolean}
   * @protected
   */

		EventEmitter.prototype.matchesListener_ = function matchesListener_(listenerObj, listener) {
			return listenerObj.fn === listener || listenerObj.origin && listenerObj.origin === listener;
		};

		/**
   * Converts the parameter to an array if only one event is given.
   * @param  {!(Array|string)} events
   * @return {!Array}
   * @protected
   */

		EventEmitter.prototype.normalizeEvents_ = function normalizeEvents_(events) {
			return core.isString(events) ? [events] : events;
		};

		/**
   * Removes a listener for the specified events.
   * Caution: changes array indices in the listener array behind the listener.
   * @param {!(Array|string)} events
   * @param {!Function} listener
   * @return {!Object} Returns emitter, so calls can be chained.
   */

		EventEmitter.prototype.off = function off(events, listener) {
			this.validateListener_(listener);

			events = this.normalizeEvents_(events);
			for (var i = 0; i < events.length; i++) {
				var listenerObjs = this.events_[events[i]] || [];
				this.removeMatchingListenerObjs_(listenerObjs, listener);
			}

			return this;
		};

		/**
   * Adds a listener to the end of the listeners array for the specified events.
   * @param {!(Array|string)} events
   * @param {!Function} listener
   * @return {!EventHandle} Can be used to remove the listener.
   */

		EventEmitter.prototype.on = function on() {
			return this.addListener.apply(this, arguments);
		};

		/**
   * Adds a one time listener for the events. This listener is invoked only the
   * next time each event is fired, after which it is removed.
   * @param {!(Array|string)} events
   * @param {!Function} listener
   * @return {!EventHandle} Can be used to remove the listener.
   */

		EventEmitter.prototype.once = function once(events, listener) {
			return this.many(events, 1, listener);
		};

		/**
   * Removes all listeners, or those of the specified events. It's not a good
   * idea to remove listeners that were added elsewhere in the code,
   * especially when it's on an emitter that you didn't create.
   * @param {(Array|string)=} opt_events
   * @return {!Object} Returns emitter, so calls can be chained.
   */

		EventEmitter.prototype.removeAllListeners = function removeAllListeners(opt_events) {
			if (opt_events) {
				var events = this.normalizeEvents_(opt_events);
				for (var i = 0; i < events.length; i++) {
					this.events_[events[i]] = null;
				}
			} else {
				this.events_ = {};
			}
			return this;
		};

		/**
   * Removes all listener objects from the given array that match the given
   * listener function.
   * @param {!Array.<Object>} listenerObjs
   * @param {!Function} listener
   * @protected
   */

		EventEmitter.prototype.removeMatchingListenerObjs_ = function removeMatchingListenerObjs_(listenerObjs, listener) {
			for (var i = listenerObjs.length - 1; i >= 0; i--) {
				if (this.matchesListener_(listenerObjs[i], listener)) {
					listenerObjs.splice(i, 1);
				}
			}
		};

		/**
   * Removes a listener for the specified events.
   * Caution: changes array indices in the listener array behind the listener.
   * @param {!(Array|string)} events
   * @param {!Function} listener
   * @return {!Object} Returns emitter, so calls can be chained.
   */

		EventEmitter.prototype.removeListener = function removeListener() {
			return this.off.apply(this, arguments);
		};

		/**
   * By default EventEmitters will print a warning if more than 10 listeners
   * are added for a particular event. This is a useful default which helps
   * finding memory leaks. Obviously not all Emitters should be limited to 10.
   * This function allows that to be increased. Set to zero for unlimited.
   * @param {number} max The maximum number of listeners.
   * @return {!Object} Returns emitter, so calls can be chained.
   */

		EventEmitter.prototype.setMaxListeners = function setMaxListeners(max) {
			this.maxListeners_ = max;
			return this;
		};

		/**
   * Sets the configuration option which determines if an event facade should
   * be sent as a param of listeners when emitting events. If set to true, the
   * facade will be passed as the first argument of the listener.
   * @param {boolean} shouldUseFacade
   * @return {!Object} Returns emitter, so calls can be chained.
   */

		EventEmitter.prototype.setShouldUseFacade = function setShouldUseFacade(shouldUseFacade) {
			this.shouldUseFacade_ = shouldUseFacade;
			return this;
		};

		/**
   * Checks if the given listener is valid, throwing an exception when it's not.
   * @param  {*} listener
   * @protected
   */

		EventEmitter.prototype.validateListener_ = function validateListener_(listener) {
			if (!core.isFunction(listener)) {
				throw new TypeError('Listener must be a function');
			}
		};

		return EventEmitter;
	})(Disposable);

	EventEmitter.prototype.registerMetalComponent && EventEmitter.prototype.registerMetalComponent(EventEmitter, 'EventEmitter')
	this.metal.EventEmitter = EventEmitter;
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
			Channel = function () {
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
				var onmessage = (function (e) {
					// Validate origin and message to make sure that this message was
					// intended for us.
					if (e.origin !== origin && e.data !== message) {
						return;
					}
					this.port1.onmessage();
				}).bind(this);
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

(function () {
	var array = this.metal.array;
	var core = this.metal.core;
	var object = this.metal.object;
	var EventEmitter = this.metal.EventEmitter;
	var async = this.metal.async;

	/**
  * Attribute adds support for having object properties that can be watched for
  * changes, as well as configured with validators, setters and other options.
  * See the `addAttr` method for a complete list of available attribute
  * configuration options.
  * @constructor
  * @extends {EventEmitter}
  */

	var Attribute = (function (_EventEmitter) {
		babelHelpers.inherits(Attribute, _EventEmitter);

		function Attribute(opt_config) {
			babelHelpers.classCallCheck(this, Attribute);

			/**
    * Object with information about the batch event that is currently
    * scheduled, or null if none is.
    * @type {Object}
    * @protected
    */

			var _this = babelHelpers.possibleConstructorReturn(this, _EventEmitter.call(this));

			_this.scheduledBatchData_ = null;

			/**
    * Object that contains information about all this instance's attributes.
    * @type {!Object<string, !Object>}
    * @protected
    */
			_this.attrsInfo_ = {};

			_this.setShouldUseFacade(true);
			_this.mergeInvalidAttrs_();
			_this.addAttrsFromStaticHint_(opt_config);
			return _this;
		}

		/**
   * Adds the given attribute.
   * @param {string} name The name of the new attribute.
   * @param {Object.<string, *>=} config The configuration object for the new attribute.
   *   This object can have the following keys:
   *   setter - Function for normalizing new attribute values. It receives the new value
   *   that was set, and returns the value that should be stored.
   *   validator - Function that validates new attribute values. When it returns false,
   *   the new value is ignored.
   *   value - The default value for this attribute. Note that setting this to an object
   *   will cause all attribute instances to use the same reference to the object. To
   *   have each attribute instance use a different reference, use the `valueFn` option
   *   instead.
   *   valueFn - A function that returns the default value for this attribute.
   *   writeOnce - Ignores writes to the attribute after it's been first written to. That is,
   *   allows writes only when setting the attribute for the first time.
   * @param {*} initialValue The initial value of the new attribute. This value has higher
   *   precedence than the default value specified in this attribute's configuration.
   */

		Attribute.prototype.addAttr = function addAttr(name, config, initialValue) {
			this.buildAttrInfo_(name, config, initialValue);
			Object.defineProperty(this, name, this.buildAttrPropertyDef_(name));
		};

		/**
   * Adds the given attributes.
   * @param {!Object.<string, !Object>} configs An object that maps the names of all the
   *   attributes to be added to their configuration objects.
   * @param {!Object.<string, *>} initialValues An object that maps the names of
   *   attributes to their initial values. These values have higher precedence than the
   *   default values specified in the attribute configurations.
   * @param {boolean|Object=} opt_defineContext If value is false
   *     `Object.defineProperties` will not be called. If value is a valid
   *     context it will be used as definition context, otherwise `this`
   *     will be the context.
   */

		Attribute.prototype.addAttrs = function addAttrs(configs, initialValues, opt_defineContext) {
			initialValues = initialValues || {};
			var names = Object.keys(configs);

			var props = {};
			for (var i = 0; i < names.length; i++) {
				var name = names[i];
				this.buildAttrInfo_(name, configs[name], initialValues[name]);
				props[name] = this.buildAttrPropertyDef_(name);
			}

			if (opt_defineContext !== false) {
				Object.defineProperties(opt_defineContext || this, props);
			}
		};

		/**
   * Adds attributes from super classes static hint `MyClass.ATTRS = {};`.
   * @param {!Object.<string, !Object>} configs An object that maps the names
   *     of all the attributes to be added to their configuration objects.
   * @protected
   */

		Attribute.prototype.addAttrsFromStaticHint_ = function addAttrsFromStaticHint_(config) {
			var ctor = this.constructor;
			var defineContext = false;
			if (Attribute.mergeAttrsStatic(ctor)) {
				defineContext = ctor.prototype;
			}
			this.addAttrs(ctor.ATTRS_MERGED, config, defineContext);
		};

		/**
   * Checks that the given name is a valid attribute name. If it's not, an error
   * will be thrown.
   * @param {string} name The name to be validated.
   * @throws {Error}
   */

		Attribute.prototype.assertValidAttrName_ = function assertValidAttrName_(name) {
			if (this.constructor.INVALID_ATTRS_MERGED[name]) {
				throw new Error('It\'s not allowed to create an attribute with the name "' + name + '".');
			}
		};

		/**
   * Builds the info object for the requested attribute.
   * @param {string} name The name of the attribute.
   * @param {Object} config The config object of the attribute.
   * @param {*} initialValue The initial value of the attribute.
   * @protected
   */

		Attribute.prototype.buildAttrInfo_ = function buildAttrInfo_(name, config, initialValue) {
			this.assertValidAttrName_(name);

			this.attrsInfo_[name] = {
				config: config || {},
				initialValue: initialValue,
				state: Attribute.States.UNINITIALIZED
			};
		};

		/**
   * Builds the property definition object for the requested attribute.
   * @param {string} name The name of the attribute.
   * @return {!Object}
   * @protected
   */

		Attribute.prototype.buildAttrPropertyDef_ = function buildAttrPropertyDef_(name) {
			return {
				configurable: true,
				enumerable: true,
				get: function get() {
					return this.getAttrValue_(name);
				},
				set: function set(val) {
					this.setAttrValue_(name, val);
				}
			};
		};

		/**
   * Calls the requested function, running the appropriate code for when it's
   * passed as an actual function object or just the function's name.
   * @param {!Function|string} fn Function, or name of the function to run.
   * @param {!Array} An optional array of parameters to be passed to the
   *   function that will be called.
   * @return {*} The return value of the called function.
   * @protected
   */

		Attribute.prototype.callFunction_ = function callFunction_(fn, args) {
			if (core.isString(fn)) {
				return this[fn].apply(this, args);
			} else if (core.isFunction(fn)) {
				return fn.apply(this, args);
			}
		};

		/**
   * Calls the attribute's setter, if there is one.
   * @param {string} name The name of the attribute.
   * @param {*} value The value to be set.
   * @return {*} The final value to be set.
   */

		Attribute.prototype.callSetter_ = function callSetter_(name, value) {
			var info = this.attrsInfo_[name];
			var config = info.config;
			if (config.setter) {
				value = this.callFunction_(config.setter, [value]);
			}
			return value;
		};

		/**
   * Calls the attribute's validator, if there is one.
   * @param {string} name The name of the attribute.
   * @param {*} value The value to be validated.
   * @return {boolean} Flag indicating if value is valid or not.
   */

		Attribute.prototype.callValidator_ = function callValidator_(name, value) {
			var info = this.attrsInfo_[name];
			var config = info.config;
			if (config.validator) {
				return this.callFunction_(config.validator, [value]);
			}
			return true;
		};

		/**
   * Checks if the it's allowed to write on the requested attribute.
   * @param {string} name The name of the attribute.
   * @return {boolean}
   */

		Attribute.prototype.canSetAttribute = function canSetAttribute(name) {
			var info = this.attrsInfo_[name];
			return !info.config.writeOnce || !info.written;
		};

		/**
   * @inheritDoc
   */

		Attribute.prototype.disposeInternal = function disposeInternal() {
			_EventEmitter.prototype.disposeInternal.call(this);
			this.attrsInfo_ = null;
			this.scheduledBatchData_ = null;
		};

		/**
   * Emits the attribute change batch event.
   * @protected
   */

		Attribute.prototype.emitBatchEvent_ = function emitBatchEvent_() {
			if (!this.isDisposed()) {
				var data = this.scheduledBatchData_;
				this.scheduledBatchData_ = null;
				this.emit('attrsChanged', data);
			}
		};

		/**
   * Returns the value of the requested attribute.
   * Note: this can and should be accomplished by accessing the attribute as a regular property.
   * This should only be used in cases where a function is actually needed.
   * @param {string} name
   * @return {*}
   */

		Attribute.prototype.get = function get(name) {
			return this[name];
		};

		/**
   * Gets the config object for the requested attribute.
   * @param {string} name The attribute's name.
   * @return {Object}
   * @protected
   */

		Attribute.prototype.getAttrConfig = function getAttrConfig(name) {
			return (this.attrsInfo_[name] || {}).config;
		};

		/**
   * Returns an object that maps attribute names to their values.
   * @param {Array<string>=} opt_names A list of names of the attributes that should be
   *   returned. If none is given, all attributes will be returned.
   * @return {Object.<string, *>}
   */

		Attribute.prototype.getAttrs = function getAttrs(opt_names) {
			var attrsMap = {};
			var names = opt_names || this.getAttrNames();

			for (var i = 0; i < names.length; i++) {
				attrsMap[names[i]] = this[names[i]];
			}

			return attrsMap;
		};

		/**
   * Returns an array with all attribute names.
   * @return {Array.<string>}
   */

		Attribute.prototype.getAttrNames = function getAttrNames() {
			return Object.keys(this.attrsInfo_);
		};

		/**
   * Gets the value of the specified attribute. This is passed as that attribute's
   * getter to the `Object.defineProperty` call inside the `addAttr` method.
   * @param {string} name The name of the attribute.
   * @return {*}
   * @protected
   */

		Attribute.prototype.getAttrValue_ = function getAttrValue_(name) {
			this.initAttr_(name);

			return this.attrsInfo_[name].value;
		};

		/**
   * Informs of changes to an attributes value through an event. Won't trigger
   * the event if the value hasn't changed or if it's being initialized.
   * @param {string} name The name of the attribute.
   * @param {*} prevVal The previous value of the attribute.
   * @protected
   */

		Attribute.prototype.informChange_ = function informChange_(name, prevVal) {
			if (this.shouldInformChange_(name, prevVal)) {
				var data = {
					attrName: name,
					newVal: this[name],
					prevVal: prevVal
				};
				this.emit(name + 'Changed', data);
				this.scheduleBatchEvent_(data);
			}
		};

		/**
   * Initializes the specified attribute, giving it a first value.
   * @param {string} name The name of the attribute.
   * @protected
   */

		Attribute.prototype.initAttr_ = function initAttr_(name) {
			var info = this.attrsInfo_[name];
			if (info.state !== Attribute.States.UNINITIALIZED) {
				return;
			}

			info.state = Attribute.States.INITIALIZING;
			this.setInitialValue_(name);
			if (!info.written) {
				info.state = Attribute.States.INITIALIZING_DEFAULT;
				this.setDefaultValue_(name);
			}
			info.state = Attribute.States.INITIALIZED;
		};

		/**
   * Merges an array of values for the ATTRS property into a single object.
   * @param {!Array} values The values to be merged.
   * @return {!Object} The merged value.
   * @static
   * @protected
   */

		Attribute.mergeAttrs_ = function mergeAttrs_(values) {
			return object.mixin.apply(null, [{}].concat(values.reverse()));
		};

		/**
   * Merges the ATTRS static variable for the given constructor function.
   * @param  {!Function} ctor Constructor function.
   * @return {boolean} Returns true if merge happens, false otherwise.
   * @static
   */

		Attribute.mergeAttrsStatic = function mergeAttrsStatic(ctor) {
			return core.mergeSuperClassesProperty(ctor, 'ATTRS', Attribute.mergeAttrs_);
		};

		/**
   * Merges the values of the `INVALID_ATTRS` static for the whole hierarchy of
   * the current instance.
   * @protected
   */

		Attribute.prototype.mergeInvalidAttrs_ = function mergeInvalidAttrs_() {
			core.mergeSuperClassesProperty(this.constructor, 'INVALID_ATTRS', function (values) {
				return array.flatten(values).reduce(function (merged, val) {
					if (val) {
						merged[val] = true;
					}
					return merged;
				}, {});
			});
		};

		/**
   * Removes the requested attribute.
   * @param {string} name The name of the attribute.
   */

		Attribute.prototype.removeAttr = function removeAttr(name) {
			this.attrsInfo_[name] = null;
			delete this[name];
		};

		/**
   * Schedules an attribute change batch event to be emitted asynchronously.
   * @param {!Object} attrChangeData Information about an attribute's update.
   * @protected
   */

		Attribute.prototype.scheduleBatchEvent_ = function scheduleBatchEvent_(attrChangeData) {
			if (!this.scheduledBatchData_) {
				async.nextTick(this.emitBatchEvent_, this);
				this.scheduledBatchData_ = {
					changes: {}
				};
			}

			var name = attrChangeData.attrName;
			var changes = this.scheduledBatchData_.changes;
			if (changes[name]) {
				changes[name].newVal = attrChangeData.newVal;
			} else {
				changes[name] = attrChangeData;
			}
		};

		/**
   * Sets the value of the requested attribute.
   * Note: this can and should be accomplished by setting the attribute as a regular property.
   * This should only be used in cases where a function is actually needed.
   * @param {string} name
   * @param {*} value
   * @return {*}
   */

		Attribute.prototype.set = function set(name, value) {
			this[name] = value;
		};

		/**
   * Sets the value of all the specified attributes.
   * @param {!Object.<string,*>} values A map of attribute names to the values they
   *   should be set to.
   */

		Attribute.prototype.setAttrs = function setAttrs(values) {
			var names = Object.keys(values);

			for (var i = 0; i < names.length; i++) {
				this[names[i]] = values[names[i]];
			}
		};

		/**
   * Sets the value of the specified attribute. This is passed as that attribute's
   * setter to the `Object.defineProperty` call inside the `addAttr` method.
   * @param {string} name The name of the attribute.
   * @param {*} value The new value of the attribute.
   * @protected
   */

		Attribute.prototype.setAttrValue_ = function setAttrValue_(name, value) {
			if (!this.canSetAttribute(name) || !this.validateAttrValue_(name, value)) {
				return;
			}

			var info = this.attrsInfo_[name];
			if (info.initialValue === undefined && info.state === Attribute.States.UNINITIALIZED) {
				info.state = Attribute.States.INITIALIZED;
			}

			var prevVal = this[name];
			info.value = this.callSetter_(name, value);
			info.written = true;
			this.informChange_(name, prevVal);
		};

		/**
   * Sets the default value of the requested attribute.
   * @param {string} name The name of the attribute.
   * @return {*}
   */

		Attribute.prototype.setDefaultValue_ = function setDefaultValue_(name) {
			var config = this.attrsInfo_[name].config;

			if (config.value !== undefined) {
				this[name] = config.value;
			} else {
				this[name] = this.callFunction_(config.valueFn);
			}
		};

		/**
   * Sets the initial value of the requested attribute.
   * @param {string} name The name of the attribute.
   * @return {*}
   */

		Attribute.prototype.setInitialValue_ = function setInitialValue_(name) {
			var info = this.attrsInfo_[name];
			if (info.initialValue !== undefined) {
				this[name] = info.initialValue;
				info.initialValue = undefined;
			}
		};

		/**
   * Checks if we should inform about an attributes update. Updates are ignored
   * during attribute initialization. Otherwise, updates to primitive values
   * are only informed when the new value is different from the previous
   * one. Updates to objects (which includes functions and arrays) are always
   * informed outside initialization though, since we can't be sure if all of
   * the internal data has stayed the same.
   * @param {string} name The name of the attribute.
   * @param {*} prevVal The previous value of the attribute.
   * @return {boolean}
   */

		Attribute.prototype.shouldInformChange_ = function shouldInformChange_(name, prevVal) {
			var info = this.attrsInfo_[name];
			return info.state === Attribute.States.INITIALIZED && (core.isObject(prevVal) || prevVal !== this[name]);
		};

		/**
   * Validates the attribute's value, which includes calling the validator defined
   * in the attribute's configuration object, if there is one.
   * @param {string} name The name of the attribute.
   * @param {*} value The value to be validated.
   * @return {boolean} Flag indicating if value is valid or not.
   */

		Attribute.prototype.validateAttrValue_ = function validateAttrValue_(name, value) {
			var info = this.attrsInfo_[name];

			return info.state === Attribute.States.INITIALIZING_DEFAULT || this.callValidator_(name, value);
		};

		return Attribute;
	})(EventEmitter);

	/**
  * A list with attribute names that will automatically be rejected as invalid.
  * Subclasses can define their own invalid attributes by setting this static
  * on their constructors, which will be merged together and handled automatically.
  * @type {!Array<string>}
  */

	Attribute.prototype.registerMetalComponent && Attribute.prototype.registerMetalComponent(Attribute, 'Attribute')
	Attribute.INVALID_ATTRS = ['attrs'];

	/**
  * Constants that represent the states that an attribute can be in.
  * @type {!Object}
  */
	Attribute.States = {
		UNINITIALIZED: 0,
		INITIALIZING: 1,
		INITIALIZING_DEFAULT: 2,
		INITIALIZED: 3
	};

	this.metal.Attribute = Attribute;
}).call(this);
'use strict';

(function () {
	var Disposable = this.metal.Disposable;

	/**
  * EventHandler utility. It's useful for easily removing a group of
  * listeners from different EventEmitter instances.
  * @constructor
  * @extends {Disposable}
  */

	var EventHandler = (function (_Disposable) {
		babelHelpers.inherits(EventHandler, _Disposable);

		function EventHandler() {
			babelHelpers.classCallCheck(this, EventHandler);

			/**
    * An array that holds the added event handles, so the listeners can be
    * removed later.
    * @type {Array.<EventHandle>}
    * @protected
    */

			var _this = babelHelpers.possibleConstructorReturn(this, _Disposable.call(this));

			_this.eventHandles_ = [];
			return _this;
		}

		/**
   * Adds event handles to be removed later through the `removeAllListeners`
   * method.
   * @param {...(!EventHandle)} var_args
   */

		EventHandler.prototype.add = function add() {
			for (var i = 0; i < arguments.length; i++) {
				this.eventHandles_.push(arguments[i]);
			}
		};

		/**
   * Disposes of this instance's object references.
   * @override
   */

		EventHandler.prototype.disposeInternal = function disposeInternal() {
			this.eventHandles_ = null;
		};

		/**
   * Removes all listeners that have been added through the `add` method.
   */

		EventHandler.prototype.removeAllListeners = function removeAllListeners() {
			for (var i = 0; i < this.eventHandles_.length; i++) {
				this.eventHandles_[i].removeListener();
			}

			this.eventHandles_ = [];
		};

		return EventHandler;
	})(Disposable);

	EventHandler.prototype.registerMetalComponent && EventHandler.prototype.registerMetalComponent(EventHandler, 'EventHandler')
	this.metal.EventHandler = EventHandler;
}).call(this);
'use strict';

(function () {
	var core = this.metal.core;
	var dom = this.metal.dom;
	var Attribute = this.metal.Attribute;
	var EventHandler = this.metal.EventHandler;

	/**
  * Toggler component.
  */

	var Toggler = (function (_Attribute) {
		babelHelpers.inherits(Toggler, _Attribute);

		/**
   * @inheritDoc
   */

		function Toggler(opt_config) {
			babelHelpers.classCallCheck(this, Toggler);

			var _this = babelHelpers.possibleConstructorReturn(this, _Attribute.call(this, opt_config));

			_this.headerEventHandler_ = new EventHandler();

			_this.on('headerChanged', _this.syncHeader);
			_this.syncHeader();
			return _this;
		}

		/**
   * @inheritDoc
   */

		Toggler.prototype.disposeInternal = function disposeInternal() {
			_Attribute.prototype.disposeInternal.call(this);
			this.headerEventHandler_.removeAllListeners();
		};

		/**
   * Gets the content to be toggled by the given header element.
   * @param {!Element} header
   * @protected
   */

		Toggler.prototype.getContentElement_ = function getContentElement_(header) {
			if (core.isElement(this.content)) {
				return this.content;
			}

			var content = dom.next(header, this.content);
			if (content) {
				return content;
			}

			content = header.querySelector(this.content);
			if (content) {
				return content;
			}

			return this.container.querySelector(this.content);
		};

		/**
   * Handles a `click` event on the header.
   * @param {!Event} event
   * @protected
   */

		Toggler.prototype.handleClick_ = function handleClick_(event) {
			this.toggle(event.delegateTarget || event.currentTarget);
		};

		/**
   * Handles a `keydown` event on the header.
   * @param {!Event} event
   * @protected
   */

		Toggler.prototype.handleKeydown_ = function handleKeydown_(event) {
			if (event.keyCode === 13 || event.keyCode === 32) {
				this.toggle(event.delegateTarget || event.currentTarget);
				event.preventDefault();
			}
		};

		/**
   * Syncs the component according to the value of the `header` attribute,
   * attaching events to the new element and detaching from any previous one.
   */

		Toggler.prototype.syncHeader = function syncHeader() {
			this.headerEventHandler_.removeAllListeners();
			if (this.header) {
				if (core.isString(this.header)) {
					this.headerEventHandler_.add(dom.delegate(this.container, 'click', this.header, this.handleClick_.bind(this)), dom.delegate(this.container, 'keydown', this.header, this.handleKeydown_.bind(this)));
				} else {
					this.headerEventHandler_.add(dom.on(this.header, 'click', this.handleClick_.bind(this)), dom.on(this.header, 'keydown', this.handleKeydown_.bind(this)));
				}
			}
		};

		/**
   * Toggles the content's visibility.
   */

		Toggler.prototype.toggle = function toggle(header) {
			var content = this.getContentElement_(header);
			dom.toggleClasses(content, Toggler.CSS_EXPANDED);
			dom.toggleClasses(content, Toggler.CSS_COLLAPSED);
		};

		return Toggler;
	})(Attribute);

	/**
  * Attributes configuration.
  */

	Toggler.prototype.registerMetalComponent && Toggler.prototype.registerMetalComponent(Toggler, 'Toggler')
	Toggler.ATTRS = {
		/**
   * The element where the header/content selectors will be looked for.
   * @type {string|!Element}
   */
		container: {
			setter: dom.toElement,
			validator: function validator(value) {
				return core.isString(value) || core.isElement(value);
			},
			value: document
		},

		/**
   * The element that should be expanded/collapsed by this toggler.
   * @type {string|!Element}
   */
		content: {
			validator: function validator(value) {
				return core.isString(value) || core.isElement(value);
			}
		},

		/**
   * The element that should be trigger toggling.
   * @type {string|!Element}
   */
		header: {
			validator: function validator(value) {
				return core.isString(value) || core.isElement(value);
			}
		}
	};

	/**
  * The CSS class added to the content when it's collapsed.
  */
	Toggler.CSS_COLLAPSED = 'toggler-collapsed';

	/**
  * The CSS class added to the content when it's expanded.
  */
	Toggler.CSS_EXPANDED = 'toggler-expanded';

	this.metal.Toggler = Toggler;
}).call(this);
}).call(this);
//# sourceMappingURL=toggler.js.map
