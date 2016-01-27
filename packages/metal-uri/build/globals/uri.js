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
	var Disposable = this.metal.Disposable;

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

			_this.keys = {};
			_this.values = {};
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
			this.keys = {};
			this.values = {};
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

	MultiMap.prototype.registerMetalComponent && MultiMap.prototype.registerMetalComponent(MultiMap, 'MultiMap')
	this.metal.MultiMap = MultiMap;
}).call(this);
'use strict';

(function () {
	var core = this.metal.core;
	var MultiMap = this.metal.MultiMap;

	var Uri = function () {

		/**
   * This class contains setters and getters for the parts of the URI.This
   * class contains setters and getters for the parts of the URI.
   * @param {*=} opt_uri Optional string URI to parse
   * @constructor
   */

		function Uri() {
			var opt_uri = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
			babelHelpers.classCallCheck(this, Uri);

			this.url = new URL(this.maybeAddProtocolAndHostname_(opt_uri));
		}

		/**
   * Adds the value of the named query parameters.
   * @param {string} key The parameter to set.
   * @param {*} value The new value. Will be explicitly casted to String.
   * @chainable
   */

		Uri.prototype.addParameterValue = function addParameterValue(name, value) {
			this.ensureQueryInitialized_();
			if (core.isDef(value)) {
				value = decodeURIComponent(String(value));
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
			var _this = this;

			values.forEach(function (value) {
				return _this.addParameterValue(name, value);
			});
			return this;
		};

		/**
   * Ensures query internal map is initialized and synced with initial value
   * extracted from URI search part.
   * @protected
   */

		Uri.prototype.ensureQueryInitialized_ = function ensureQueryInitialized_() {
			var _this2 = this;

			if (this.query) {
				return;
			}
			this.query = new MultiMap();
			var search = this.url.search;
			if (search) {
				search.substring(1).split('&').forEach(function (param) {
					var pieces = param.split('=');
					_this2.addParameterValue(pieces[0], pieces[1]);
				});
			}
		};

		/**
   * Gets the hash part of uri.
   * @return {string}
   */

		Uri.prototype.getHash = function getHash() {
			return this.url.hash;
		};

		/**
   * Gets the host part of uri. E.g. <code>[hostname]:[port]</code>.
   * @return {string}
   */

		Uri.prototype.getHost = function getHost() {
			var host = this.getHostname();
			if (host) {
				var port = this.getPort();
				if (port) {
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
   * Gets the password part of uri.
   * @return {string}
   */

		Uri.prototype.getPassword = function getPassword() {
			return this.url.password;
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
			var _this3 = this;

			var search = '';
			var querystring = '';
			this.getParameterNames().forEach(function (name) {
				_this3.getParameterValues(name).forEach(function (value) {
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
   * Gets the username part of uri.
   * @return {string}
   */

		Uri.prototype.getUsername = function getUsername() {
			return this.url.username;
		};

		/**
   * Maybe adds protocol and a hostname placeholder on a parial URI if needed.
   * Relevent for compatibility with <code>URL</code> native object.
   * @param {string=} opt_uri
   * @return {string} URI with protocol and hostname placeholder.
   */

		Uri.prototype.maybeAddProtocolAndHostname_ = function maybeAddProtocolAndHostname_(opt_uri) {
			var url = opt_uri;
			if (opt_uri.indexOf('://') === -1) {
				url = Uri.DEFAULT_PROTOCOL + '//';

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
						url += Uri.HOSTNAME_PLACEHOLDER;
						url += opt_uri;
						break;
					default:
						url += opt_uri;
				}
			}
			return url;
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
			var _this4 = this;

			this.removeParameter(name);
			values.forEach(function (value) {
				return _this4.addParameterValue(name, value);
			});
			return this;
		};

		/**
   * Sets the password.
   * @param {string} password
   * @chainable
   */

		Uri.prototype.setPassword = function setPassword(password) {
			this.url.password = password;
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
   * Sets the protocol. If missing <code>http:</code> is used as default.
   * @param {string} protocol
   * @chainable
   */

		Uri.prototype.setProtocol = function setProtocol(protocol) {
			this.url.protocol = protocol;
			return this;
		};

		/**
   * Sets the username.
   * @param {string} username
   * @chainable
   */

		Uri.prototype.setUsername = function setUsername(username) {
			this.url.username = username;
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
				var username = this.getUsername();
				var password = this.getPassword();
				if (username && password) {
					href += username + ':' + password + '@';
				}
			}
			href += host + this.getPathname() + this.getSearch() + this.getHash();
			return href;
		};

		return Uri;
	}();

	/**
  * Default protocol value.
  * @type {String}
  * @default http:
  * @static
  */

	Uri.DEFAULT_PROTOCOL = 'http:';

	/**
  * Hostname placeholder. Relevant to internal usage only.
  * @type {String}
  * @static
  */
	Uri.HOSTNAME_PLACEHOLDER = 'hostname' + Date.now();

	this.metal.Uri = Uri;
}).call(this);
}).call(this);
//# sourceMappingURL=uri.js.map
