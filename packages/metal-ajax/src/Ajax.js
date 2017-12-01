'use strict';

import {isDef, isDefAndNotNull} from 'metal';
import Uri from 'metal-uri';
import {ProgressPromise as Promise} from 'metal-promise';

/**
 * Ajax class
 */
class Ajax {
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
		let headers = [];
		if (!allHeaders) {
			return headers;
		}
		let pairs = allHeaders.split('\u000d\u000a');
		for (let i = 0; i < pairs.length; i++) {
			let index = pairs[i].indexOf('\u003a\u0020');
			if (index > 0) {
				let name = pairs[i].substring(0, index);
				let value = pairs[i].substring(index + 2);
				headers.push({
					name: name,
					value: value,
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
	 * @param {MultiMap=} headers
	 * @param {MultiMap=} params
	 * @param {number=} timeout
	 * @param {boolean=} sync
	 * @param {boolean=} withCredentials
	 * @return {Promise} Deferred ajax request.
	 * @protected
	 */
	static request(
		url,
		method,
		body,
		headers,
		params,
		timeout,
		sync,
		withCredentials
	) {
		url = url || '';
		method = method || 'GET';

		let request = new XMLHttpRequest();
		let previousReadyState = 0;

		let promise = new Promise(function(resolve, reject, progress) {
			request.onload = function() {
				if (request.aborted) {
					request.onerror();
					return;
				}
				resolve(request);
			};
			request.onprogress = function(progressEvent) {
				if (progressEvent.lengthComputable) {
					progress(progressEvent.loaded / progressEvent.total);
				}
			};
			request.onreadystatechange = function() {
				if (
					previousReadyState &&
					previousReadyState < 3 &&
					4 === request.readyState
				) {
					request.terminatedPrematurely = true;
				}
				previousReadyState = request.readyState;
			};
			request.onerror = function() {
				let message = 'Request error';
				if (request.terminatedPrematurely) {
					message = 'Request terminated prematurely';
				}
				let error = new Error(message);
				error.request = request;
				reject(error);
			};
		})
			.thenCatch(function(reason) {
				request.abort();
				throw reason;
			})
			.thenAlways(function() {
				clearTimeout(reqTimeout);
			});

		url = new Uri(url);

		if (params) {
			url.addParametersFromMultiMap(params).toString();
		}

		url = url.toString();

		request.open(method, url, !sync);

		if (withCredentials) {
			request.withCredentials = true;
		}

		if (headers) {
			headers.names().forEach(function(name) {
				request.setRequestHeader(name, headers.getAll(name).join(', '));
			});
		}

		request.send(isDef(body) ? body : null);

		let reqTimeout;

		if (isDefAndNotNull(timeout)) {
			reqTimeout = setTimeout(function() {
				promise.cancel('Request timeout');
			}, timeout);
		}

		return promise;
	}
}

export default Ajax;
