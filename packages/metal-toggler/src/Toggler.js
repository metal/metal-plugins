'use strict';

import core from 'bower:metal/src/core';
import dom from 'bower:metal/src/dom/dom';
import Attribute from 'bower:metal/src/attribute/Attribute';
import EventHandler from 'bower:metal/src/events/EventHandler';

/**
 * Toggler component.
 */
class Toggler extends Attribute {
	/**
	 * @inheritDoc
	 */
  constructor(opt_config) {
    super(opt_config);

    this.headerEventHandler_ = new EventHandler();

    this.on('expandedChanged', this.syncExpanded);
    this.on('headerChanged', this.syncHeader);

    this.syncExpanded();
    this.syncHeader();
  }

  /**
   * Handles a `keydown` event on the header.
   * @param {!Event} event
   * @protected
   */
  handleKeydown_(event) {
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.toggle();
      event.preventDefault();
    }
  }

  /**
   * Syncs the component according to the value of the `expanded` attribute,
   * updating the css class of the `content` element.
   */
  syncExpanded() {
    if (this.expanded) {
      dom.addClasses(this.content, Toggler.CSS_EXPANDED);
      dom.removeClasses(this.content, Toggler.CSS_COLLAPSED);
    } else {
      dom.removeClasses(this.content, Toggler.CSS_EXPANDED);
      dom.addClasses(this.content, Toggler.CSS_COLLAPSED);
    }
  }

  /**
   * Syncs the component according to the value of the `header` attribute,
   * attaching events to the new element and detaching from any previous one.
   */
  syncHeader() {
    this.headerEventHandler_.removeAllListeners();
    if (this.header) {
      this.headerEventHandler_.add(
        dom.on(this.header, 'click', this.toggle.bind(this)),
        dom.on(this.header, 'keydown', this.handleKeydown_.bind(this))
      );
    }
  }

  /**
   * Toggles the content's visibility.
   */
  toggle() {
    this.expanded = !this.expanded;
  }
}

/**
 * Attributes configuration.
 */
Toggler.ATTRS = {
  /**
   * The element that should be expanded/collapsed by this toggler.
   * @type {string|!Element}
   */
  content: {
    setter: dom.toElement,
    validator: value => core.isString(value) || core.isElement(value)
  },

  /**
   * Flag indicating if the content is currently expanded or collapsed.
   * @type {boolean}
   */
  expanded: {
    value: false
  },

  /**
   * The element that should be trigger toggling.
   * @type {string|!Element}
   */
  header: {
    setter: dom.toElement,
    validator: value => core.isString(value) || core.isElement(value)
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

export default Toggler;
