'use strict';

import core from 'metal/src/core';
import MultiMap from 'metal-multimap/src/MultiMap';

class Uri {

	/**
	 * This class contains setters and getters for the parts of the URI.This
	 * class contains setters and getters for the parts of the URI.
	 * @param {*=} opt_uri Optional string URI to parse
	 * @constructor
	 */
	constructor(opt_uri = '') {
		this.url = new URL(this.maybeAddProtocolAndHostname_(opt_uri));
	}

	/**
	 * Adds the value of the named query parameters.
	 * @param {string} key The parameter to set.
	 * @param {*} value The new value. Will be explicitly casted to String.
	 * @chainable
	 */
	addParameterValue(name, value) {
		this.ensureQueryInitialized_();
		if (core.isDef(value)) {
			value = String(value);
		}
		this.query.add(name, value);
		return this;
	}

	/**
	 * Adds the values of the named query parameter.
	 * @param {string} key The parameter to set.
	 * @param {*} value The new value.
	 * @chainable
	 */
	addParameterValues(name, values) {
		values.forEach((value) => this.addParameterValue(name, value));
		return this;
	}

	/**
	 * Ensures query internal map is initialized and synced with initial value
	 * extracted from URI search part.
	 * @protected
	 */
	ensureQueryInitialized_() {
		if (this.query) {
			return;
		}
		this.query = new MultiMap();
		var search = this.url.search;
		if (search) {
			search.substring(1).split('&').forEach((param) => {
				var [key, value] = param.split('=');
				if (core.isDef(value)) {
					value = decodeURIComponent(value);
				}
				this.addParameterValue(key, value);
			});
		}
	}

	/**
	 * Gets the hash part of uri.
	 * @return {string}
	 */
	getHash() {
		return this.url.hash;
	}

	/**
	 * Gets the host part of uri. E.g. <code>[hostname]:[port]</code>.
	 * @return {string}
	 */
	getHost() {
		var host = this.getHostname();
		if (host) {
			var port = this.getPort();
			if (port) {
				host += ':' + port;
			}
		}
		return host;
	}

	/**
	 * Gets the hostname part of uri without protocol and port.
	 * @return {string}
	 */
	getHostname() {
		var hostname = this.url.hostname;
		if (hostname === Uri.HOSTNAME_PLACEHOLDER) {
			return '';
		}
		return hostname;
	}

	/**
	 * Gets the origin part of uri. E.g. <code>http://[hostname]:[port]</code>.
	 * @return {string}
	 */
	getOrigin() {
		var host = this.getHost();
		if (host) {
			return this.getProtocol() + '//' + host;
		}
		return '';
	}

	/**
	 * Returns the first value for a given parameter or undefined if the given
	 * parameter name does not appear in the query string.
	 * @param {string} paramName Unescaped parameter name.
	 * @return {string|undefined} The first value for a given parameter or
	 *   undefined if the given parameter name does not appear in the query
	 *   string.
	 */
	getParameterValue(name) {
		this.ensureQueryInitialized_();
		return this.query.get(name);
	}

	/**
	 * Returns the value<b>s</b> for a given parameter as a list of decoded
	 * query parameter values.
	 * @param {string} name The parameter to get values for.
	 * @return {!Array<?>} The values for a given parameter as a list of decoded
	 *   query parameter values.
	 */
	getParameterValues(name) {
		this.ensureQueryInitialized_();
		return this.query.getAll(name);
	}

	/**
	 * Returns the name<b>s</b> of the parameters.
	 * @return {!Array<string>} The names for the parameters as a list of
	 *   strings.
	 */
	getParameterNames() {
		this.ensureQueryInitialized_();
		return this.query.names();
	}

	/**
	 * Gets the password part of uri.
	 * @return {string}
	 */
	getPassword() {
		return this.url.password;
	}

	/**
	 * Gets the pathname part of uri.
	 * @return {string}
	 */
	getPathname() {
		return this.url.pathname;
	}

	/**
	 * Gets the port number part of uri as string.
	 * @return {string}
	 */
	getPort() {
		return this.url.port;
	}

	/**
	 * Gets the protocol part of uri. E.g. <code>http:</code>.
	 * @return {string}
	 */
	getProtocol() {
		return this.url.protocol;
	}

	/**
	 * Gets the search part of uri. Search value is retrieved from query
	 * parameters.
	 * @return {string}
	 */
	getSearch() {
		var search = '';
		var querystring = '';
		this.getParameterNames().forEach((name) => {
			this.getParameterValues(name).forEach((value) => {
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
	}

	/**
	 * Gets the username part of uri.
	 * @return {string}
	 */
	getUsername() {
		return this.url.username;
	}

	/**
	 * Maybe adds protocol and a hostname placeholder on a parial URI if needed.
	 * Relevent for compatibility with <code>URL</code> native object.
	 * @param {string=} opt_uri
	 * @return {string} URI with protocol and hostname placeholder.
	 */
	maybeAddProtocolAndHostname_(opt_uri) {
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
	}

	/**
	 * Removes the named query parameter.
	 * @param {string} name The parameter to remove.
	 * @chainable
	 */
	removeParameter(name) {
		this.ensureQueryInitialized_();
		this.query.remove(name);
		return this;
	}

	/**
	 * Sets the hash.
	 * @param {string} hash
	 * @chainable
	 */
	setHash(hash) {
		this.url.hash = hash;
		return this;
	}

	/**
	 * Sets the hostname.
	 * @param {string} hostname
	 * @chainable
	 */
	setHostname(hostname) {
		this.url.hostname = hostname;
		return this;
	}

	/**
	 * Sets the value of the named query parameters, clearing previous values
	 * for that key.
	 * @param {string} key The parameter to set.
	 * @param {*} value The new value.
	 * @chainable
	 */
	setParameterValue(name, value) {
		this.removeParameter(name);
		this.addParameterValue(name, value);
		return this;
	}

	/**
	 * Sets the values of the named query parameters, clearing previous values
	 * for that key.
	 * @param {string} key The parameter to set.
	 * @param {*} value The new value.
	 * @chainable
	 */
	setParameterValues(name, values) {
		this.removeParameter(name);
		values.forEach((value) => this.addParameterValue(name, value));
		return this;
	}

	/**
	 * Sets the password.
	 * @param {string} password
	 * @chainable
	 */
	setPassword(password) {
		this.url.password = password;
		return this;
	}

	/**
	 * Sets the pathname.
	 * @param {string} pathname
	 * @chainable
	 */
	setPathname(pathname) {
		this.url.pathname = pathname;
		return this;
	}

	/**
	 * Sets the port number.
	 * @param {*} port Port number.
	 * @chainable
	 */
	setPort(port) {
		this.url.port = port;
		return this;
	}

	/**
	 * Sets the protocol. If missing <code>http:</code> is used as default.
	 * @param {string} protocol
	 * @chainable
	 */
	setProtocol(protocol) {
		this.url.protocol = protocol;
		return this;
	}

	/**
	 * Sets the username.
	 * @param {string} username
	 * @chainable
	 */
	setUsername(username) {
		this.url.username = username;
		return this;
	}

	/**
	 * @return {string} The string form of the url.
	 * @override
	 */
	toString() {
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
	}

}

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

export default Uri;
