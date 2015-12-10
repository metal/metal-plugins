'use strict';

import core from 'bower:metal/src/core';
import dom from 'bower:metal/src/dom/dom';
import Attribute from 'bower:metal/src/attribute/Attribute';
import EventHandler from 'bower:metal/src/events/EventHandler';

class Toggler extends Attribute {
  constructor(opt_config) {
    super(opt_config);

    this.headerEventHandler_ = new EventHandler();

    this.on('expandedChanged', this.syncExpanded);
    this.on('headerChanged', this.syncHeader);

    this.syncExpanded();
    this.syncHeader();
  }

  handleKeydown(event) {
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.toggle();
      event.preventDefault();
    }
  }

  syncExpanded() {
    if (this.expanded) {
      dom.addClasses(this.content, Toggler.CSS_EXPANDED);
      dom.removeClasses(this.content, Toggler.CSS_COLLAPSED);
    } else {
      dom.removeClasses(this.content, Toggler.CSS_EXPANDED);
      dom.addClasses(this.content, Toggler.CSS_COLLAPSED);
    }
  }

  syncHeader() {
    this.headerEventHandler_.removeAllListeners();
    if (this.header) {
      this.headerEventHandler_.add(
        dom.on(this.header, 'click', this.toggle.bind(this)),
        dom.on(this.header, 'keydown', this.handleKeydown.bind(this))
      );
    }
  }

  toggle() {
    this.expanded = !this.expanded;
  }
}

Toggler.ATTRS = {
  content: {
    setter: dom.toElement,
    validator: value => core.isString(value) || core.isElement(value)
  },

  expanded: {
    value: false
  },

  header: {
    setter: dom.toElement,
    validator: value => core.isString(value) || core.isElement(value)
  }
};

Toggler.CSS_EXPANDED = 'toggler-expanded';
Toggler.CSS_COLLAPSED = 'toggler-collapsed';

export default Toggler;
