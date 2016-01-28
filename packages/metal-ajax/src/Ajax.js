'use strict';

import core from 'metal/src/core';
import Uri from 'metal-uri/src/Uri';
import { CancellablePromise as Promise } from 'metal-promise/src/promise/Promise';

class Ajax {

	/**
	 * Joins the given paths.
	 * @param {string} basePath
	 * @param {...string} ...paths Any number of paths to be joined with the base url.
	 */
	static joinPaths(basePath, ...paths) {
		if (basePath.charAt(basePath.length - 1) === '/') {
			basePath = basePath.substring(0, basePath.length - 1);
		}
		paths = paths.map(path => path.charAt(0) === '/' ? path.substring(1) : path);
		return [basePath].concat(paths).join('/').replace(/\/$/, '');
	}

	/**
	 * XmlHttpRequest's getAllResponseHeaders() method returns a string of
	 * response headers according to the format described on the spec:
	 * {@link http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method}.
	 * This method parses that string into a user-friendly name/value pair
	 * object.
	 * @param {string} allHeaders All headers as string.
	 * @return {!Array.<Object<string, string>>}
	 */
	static parseResponseHeaders(allHeaders) {
		var headers = [];
		if (!allHeaders) {
			return headers;
		}
		var pairs = allHeaders.split('\u000d\u000a');
		for (var i = 0; i < pairs.length; i++) {
			var index = pairs[i].indexOf('\u003a\u0020');
			if (index > 0) {
				var name = pairs[i].substring(0, index);
				var value = pairs[i].substring(index + 2);
				headers.push({
					name: name,
					value: value
				});
			}
		}
		return headers;
	}

	/**
	 * Requests the url using XMLHttpRequest.
	 * @param {!string} url
	 * @param {!string} method
	 * @param {?string} body
	 * @param {MultiMap=} opt_headers
	 * @param {MultiMap=} opt_params
	 * @param {number=} opt_timeout
	 * @param {boolean=} opt_sync
	 * @return {Promise} Deferred ajax request.
	 * @protected
	 */
	static request(url, method, body, opt_headers, opt_params, opt_timeout, opt_sync) {
		var request = new XMLHttpRequest();

		var promise = new Promise(function(resolve, reject) {
			request.onload = function() {
				if (request.aborted) {
					request.onerror();
					return;
				}
				resolve(request);
			};
			request.onerror = function() {
				var error = new Error('Request error');
				error.request = request;
				reject(error);
			};
		}).thenCatch(function(reason) {
			request.abort();
			throw reason;
		}).thenAlways(function() {
			clearTimeout(timeout);
		});

		if (opt_params) {
			url = new Uri(url).addParametersFromMultiMap(opt_params).toString();
		}

		request.open(method, url, !opt_sync);

		if (opt_headers) {
			opt_headers.names().forEach(function(name) {
				request.setRequestHeader(name, opt_headers.getAll(name).join(', '));
			});
		}

		request.send(core.isDef(body) ? body : null);

		if (core.isDefAndNotNull(opt_timeout)) {
			var timeout = setTimeout(function() {
				promise.cancel('Request timeout');
			}, opt_timeout);
		}

		return promise;
	}

}

export default Ajax;
