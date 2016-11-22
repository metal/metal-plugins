'use strict';

import { registerCustomEvent } from 'metal-dom';
import * as KEYMAP from './keyConstants';

/**
 * Creates a custom event configuration object to deal with keyboard events.
 * @param {!string} originalEvent The the original DOM event name.
 * @param {!string} keyAlias Name that represents the key code number.
 * @param {!number} keyCode The key code value.
 * @return {object} The custom keyboard event configuration that has all the
 *  necessary informations for the handler function.
 */
function createCustomKeyboardEventConfig(originalEvent, keyAlias, keyCode) {
  return {
    event: true,
    delegate: true,
    key: keyCode,
    handler: function(callback, event) {
      if (this.key === event.keyCode) {
        event.customType = originalEvent + '-' + keyAlias;
        callback(event);
      }
    },
    originalEvent: originalEvent
  };
}

Object.keys(KEYMAP).forEach(function(key) {
  let keyAlias = key.toLowerCase();

  registerCustomEvent('keydown-' + keyAlias, createCustomKeyboardEventConfig('keydown', keyAlias, KEYMAP[key]));
  registerCustomEvent('keyup-' + keyAlias, createCustomKeyboardEventConfig('keyup', keyAlias, KEYMAP[key]));
  registerCustomEvent('keypress-' + keyAlias, createCustomKeyboardEventConfig('keypress', keyAlias, KEYMAP[key]));
});

export { KEYMAP };
