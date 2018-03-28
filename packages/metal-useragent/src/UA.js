'use strict';

import {isServerSide} from 'metal';

/**
 * Metal.js browser user agent detection. It's extremely recommended the usage
 * of feature checking over browser user agent sniffing. Unfortunately, in some
 * situations feature checking can be slow or even impossible, therefore use
 * this utility with caution.
 * @see <a href="http://www.useragentstring.com/">User agent strings</a>.
 */
class UA {
	/**
	 * Gets the native userAgent string from navigator if it exists. If
	 * navigator or navigator.userAgent string is missing, returns an empty
	 * string.
	 * @return {string}
	 * @private
	 * @static
	 */
	static getNativeUserAgent() {
		var navigator = UA.globals.window && UA.globals.window.navigator;
		if (navigator) {
			var userAgent = navigator.userAgent;
			if (userAgent) {
				return userAgent;
			}
		}
		return '';
	}

	/**
	 * Gets the native platform string from navigator if it exists. If
	 * navigator or navigator.platform string is missing, returns an empty
	 * string.
	 * @return {string}
	 * @private
	 * @static
	 */
	static getNativePlatform() {
		var navigator = UA.globals.window && UA.globals.window.navigator;
		if (navigator) {
			var platform = navigator.platform;
			if (platform) {
				return platform;
			}
		}
		return '';
	}

	/**
	 * Whether the platform contains the given string, ignoring case.
	 * @param {string} str
	 * @return {boolean}
	 * @private
	 * @static
	*/
	static matchPlatform(str) {
		return UA.platform.indexOf(str) !== -1;
	}

	/**
	 * Whether the user agent contains the given string, ignoring case.
	 * @param {string} str
	 * @return {boolean}
	 * @private
	 * @static
	*/
	static matchUserAgent(str) {
		return UA.userAgent.indexOf(str) !== -1;
	}

	/**
	 * Tests the user agent.
	 * @param {string} userAgent The user agent string.
	 * @static
	 */
	static testUserAgent(userAgent = '', platform = '') {
		/**
		 * Holds the user agent value extracted from browser native user agent.
		 * @type {string}
		 * @static
		 */
		UA.userAgent = userAgent;

		/**
		 * Holds the platform value extracted from browser native platform.
		 * @type {string}
		 * @static
		 */
		UA.platform = platform;

		/**
		 * Whether the user's OS is Mac.
		 * @type {boolean}
		 * @static
		 */
		UA.isMac = UA.matchPlatform('Mac');

		/**
		 * Whether the user's OS is Win.
		 * @type {boolean}
		 * @static
		 */
		UA.isWin = UA.matchPlatform('Win');

		/**
		 * Whether the user's browser is Opera.
		 * @type {boolean}
		 * @static
		 */
		UA.isOpera = UA.matchUserAgent('Opera') || UA.matchUserAgent('OPR');

		/**
		 * Whether the user's browser is IE.
		 * @type {boolean}
		 * @static
		 */
		UA.isIe = UA.matchUserAgent('Trident') || UA.matchUserAgent('MSIE');

		/**
		 * Whether the user's browser is Edge.
		 * @type {boolean}
		 * @static
		 */
		UA.isEdge = UA.matchUserAgent('Edge');

		/**
		 * Whether the user's browser is IE or Edge.
		 * @type {boolean}
		 * @static
		 */
		UA.isIeOrEdge = UA.isIe || UA.isEdge;

		/**
		 * Whether the user's browser is Chrome.
		 * @type {boolean}
		 * @static
		 */
		UA.isChrome = (UA.matchUserAgent('Chrome') || UA.matchUserAgent('CriOS')) && !UA.isOpera && !UA.isEdge;

		/**
		 * Whether the user's browser is Safari.
		 * @type {boolean}
		 * @static
		 */
		UA.isSafari = UA.matchUserAgent('Safari') && !(UA.isChrome || UA.isOpera || UA.isEdge);

		/**
		 * Whether the user's browser is Firefox.
		 * @type {boolean}
		 * @static
		 */
		UA.isFirefox = UA.matchUserAgent('Firefox');
	}
}

/**
 * Exposes global references.
 * @type {object}
 * @static
 */
Object.defineProperty(UA, 'globals', {
  writable: true,
  value: function() {
    if (!isServerSide()) {
			return window;
		}
  }
});

UA.testUserAgent(UA.getNativeUserAgent(), UA.getNativePlatform());

export default UA;
