define(['exports', 'metal/src/core', 'metal-multimap/src/MultiMap'], function (exports, _core, _MultiMap) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _core2 = _interopRequireDefault(_core);

	var _MultiMap2 = _interopRequireDefault(_MultiMap);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var Uri = function () {
		function Uri() {
			var opt_uri = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

			_classCallCheck(this, Uri);

			this.url = new URL(this.maybeAddProtocolAndHostname_(opt_uri));
		}

		Uri.prototype.addParameterValue = function addParameterValue(name, value) {
			this.ensureQueryInitialized_();

			if (_core2.default.isDef(value)) {
				value = decodeURIComponent(String(value));
			}

			this.query.add(name, value);
			return this;
		};

		Uri.prototype.addParameterValues = function addParameterValues(name, values) {
			var _this = this;

			values.forEach(function (value) {
				return _this.addParameterValue(name, value);
			});
			return this;
		};

		Uri.prototype.ensureQueryInitialized_ = function ensureQueryInitialized_() {
			var _this2 = this;

			if (this.query) {
				return;
			}

			this.query = new _MultiMap2.default();
			var search = this.url.search;

			if (search) {
				search.substring(1).split('&').forEach(function (param) {
					var pieces = param.split('=');

					_this2.addParameterValue(pieces[0], pieces[1]);
				});
			}
		};

		Uri.prototype.getHash = function getHash() {
			return this.url.hash;
		};

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

		Uri.prototype.getHostname = function getHostname() {
			var hostname = this.url.hostname;

			if (hostname === Uri.HOSTNAME_PLACEHOLDER) {
				return '';
			}

			return hostname;
		};

		Uri.prototype.getOrigin = function getOrigin() {
			var host = this.getHost();

			if (host) {
				return this.getProtocol() + '//' + host;
			}

			return '';
		};

		Uri.prototype.getParameterValue = function getParameterValue(name) {
			this.ensureQueryInitialized_();
			return this.query.get(name);
		};

		Uri.prototype.getParameterValues = function getParameterValues(name) {
			this.ensureQueryInitialized_();
			return this.query.getAll(name);
		};

		Uri.prototype.getParameterNames = function getParameterNames() {
			this.ensureQueryInitialized_();
			return this.query.names();
		};

		Uri.prototype.getPassword = function getPassword() {
			return this.url.password;
		};

		Uri.prototype.getPathname = function getPathname() {
			return this.url.pathname;
		};

		Uri.prototype.getPort = function getPort() {
			return this.url.port;
		};

		Uri.prototype.getProtocol = function getProtocol() {
			return this.url.protocol;
		};

		Uri.prototype.getSearch = function getSearch() {
			var _this3 = this;

			var search = '';
			var querystring = '';
			this.getParameterNames().forEach(function (name) {
				_this3.getParameterValues(name).forEach(function (value) {
					querystring += name;

					if (_core2.default.isDef(value)) {
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

		Uri.prototype.getUsername = function getUsername() {
			return this.url.username;
		};

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

		Uri.prototype.removeParameter = function removeParameter(name) {
			this.ensureQueryInitialized_();
			this.query.remove(name);
			return this;
		};

		Uri.prototype.setHash = function setHash(hash) {
			this.url.hash = hash;
			return this;
		};

		Uri.prototype.setHostname = function setHostname(hostname) {
			this.url.hostname = hostname;
			return this;
		};

		Uri.prototype.setParameterValue = function setParameterValue(name, value) {
			this.removeParameter(name);
			this.addParameterValue(name, value);
			return this;
		};

		Uri.prototype.setParameterValues = function setParameterValues(name, values) {
			var _this4 = this;

			this.removeParameter(name);
			values.forEach(function (value) {
				return _this4.addParameterValue(name, value);
			});
			return this;
		};

		Uri.prototype.setPassword = function setPassword(password) {
			this.url.password = password;
			return this;
		};

		Uri.prototype.setPathname = function setPathname(pathname) {
			this.url.pathname = pathname;
			return this;
		};

		Uri.prototype.setPort = function setPort(port) {
			this.url.port = port;
			return this;
		};

		Uri.prototype.setProtocol = function setProtocol(protocol) {
			this.url.protocol = protocol;
			return this;
		};

		Uri.prototype.setUsername = function setUsername(username) {
			this.url.username = username;
			return this;
		};

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

	Uri.DEFAULT_PROTOCOL = 'http:';
	Uri.HOSTNAME_PLACEHOLDER = 'hostname' + Date.now();
	exports.default = Uri;
});
//# sourceMappingURL=Uri.js.map