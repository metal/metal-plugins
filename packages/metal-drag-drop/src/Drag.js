'use strict';

import core from 'bower:metal/src/core';
import dom from 'bower:metal/src/dom/dom';
import Attribute from 'bower:metal/src/attribute/Attribute';
import EventHandler from 'bower:metal/src/events/EventHandler';

/**
 * Responsible for making elements draggable. Handles all the logic
 * for dragging elements. Dropping is handled by `DragDrop`.
 * @extends {Attribute}
 */
class Drag extends Attribute {
	/**
	 * @inheritDoc
	 */
	constructor(opt_config) {
		super(opt_config);

		/**
		 * The drag source that is active at the moment.
		 * @type {Element}
		 * @protected
		 */
		this.activeDragSource_ = null;

		/**
		 * The current x position of the mouse (or null if not dragging).
		 * @type {?number}
		 * @protected
		 */
		this.currentMouseX_ = null;

		/**
		 * The current y position of the mouse (or null if not dragging).
		 * @type {?number}
		 * @protected
		 */
		this.currentMouseY_ = null;

		/**
		 * The current x position of the element being dragged (or null if not dragging).
		 * @type {?number}
		 * @protected
		 */
		this.currentSourceX_ = null;

		/**
		 * The current y position of the element being dragged (or null if not dragging).
		 * @type {?number}
		 * @protected
		 */
		this.currentSourceY_ = null;

		/**
		 * The distance that has been dragged.
		 * @type {Number}
		 * @protected
		 */
		this.distanceDragged_ = 0;

		/**
		 * Flag indicating if one of the sources are being dragged.
		 * @type {boolean}
		 * @protected
		 */
		this.dragging_ = false;

		/**
		 * The `EventHandler` instance that holds events that keep track of the drag action.
		 * @type {!EventHandler}
		 * @protected
		 */
		this.dragHandler_ = new EventHandler();

		/**
		 * The `EventHandler` instance that holds events that will only be detached when this
		 * instance is disposed.
		 * @type {!EventHandler}
		 * @protected
		 */
		this.eventsHandler_ = new EventHandler();

		this.attachEventToSource_('mousedown', this.handleMouseDown_.bind(this));
	}

	/**
	 * Attaches an event to the given drag source (or sources).
	 * @param {string} eventType
	 * @param {!function()} listenerFn
	 * @protected
	 */
	attachEventToSource_(eventType, listenerFn) {
		var source = this.source;
		if (core.isString(source)) {
			this.eventsHandler_.add(dom.delegate(document, eventType, source, listenerFn));
		} else {
			this.eventsHandler_.add(dom.on(source, eventType, listenerFn));
		}
	}

	/**
	 * Resets all variables to their initial values and detaches drag listeners.
	 * @protected
	 */
	cleanUpAfterDragging_() {
		this.activeDragSource_ = null;
		this.currentSourceX_ = null;
		this.currentSourceY_ = null;
		this.currentMouseX_ = null;
		this.currentMouseY_ = null;
		this.dragging_ = false;
		this.dragHandler_.removeAllListeners();
	}

	/**
	 * @inheritDoc
	 */
	disposeInternal() {
		super.disposeInternal();
		this.cleanUpAfterDragging_();

		this.dragHandler_ = null;
		this.eventsHandler_.removeAllListeners();
		this.eventsHandler_ = null;
	}

	/**
	 * Gets the active drag source.
	 * @return {Element}
	 */
	getActiveDrag() {
		return this.activeDragSource_;
	}

	/**
	 * When this is triggered and the sources were not already being dragged, more
	 * listeners will be attached to keep track of the drag action.
	 * @param {!Event} event
	 * @protected
	 */
	handleMouseDown_(event) {
		this.activeDragSource_ = event.delegateTarget || event.currentTarget;

		if (!this.isDragging()) {
			this.dragHandler_.add(
				dom.on(document, 'mousemove', this.handleMouseMove_.bind(this)),
				dom.on(document, 'mouseup', this.handleMouseUp_.bind(this))
			);

			this.currentMouseX_ = event.clientX;
			this.currentMouseY_ = event.clientY;
			this.currentSourceX_ = this.activeDragSource_.offsetLeft;
			this.currentSourceY_ = this.activeDragSource_.offsetTop;
			this.distanceDragged_ = 0;

			event.preventDefault();
		}
	}

	/**
	 * Tracks the movement of the mouse to update the drag action.
	 * @param {!Event} event
	 * @protected
	 */
	handleMouseMove_(event) {
		var distanceX = event.clientX - this.currentMouseX_;
		var distanceY = event.clientY - this.currentMouseY_;
		this.currentMouseX_ = event.clientX;
		this.currentMouseY_ = event.clientY;
		if (!this.isDragging() && !this.hasReachedMinimumDistance_(distanceX, distanceY)) {
			return;
		}

		this.dragging_ = true;
		this.currentSourceX_ += distanceX;
		this.currentSourceY_ += distanceY;

		this.emit(Drag.Events.DRAG, {
			source: this.activeDragSource_,
			x: this.currentSourceX_,
			y: this.currentSourceY_
		});

		this.activeDragSource_.style.left = this.currentSourceX_ + 'px';
		this.activeDragSource_.style.top = this.currentSourceY_ + 'px';
	}

	/**
	 * Triggered when the mouse drag action ends.
	 * @protected
	 */
	handleMouseUp_() {
		this.emit(Drag.Events.END, {
			source: this.activeDragSource_,
			x: this.currentSourceX_,
			y: this.currentSourceY_
		});
		this.cleanUpAfterDragging_();
	}

	/**
	 * Checks if the minimum distance for dragging has been reached after
	 * adding the given values.
	 * @param {number} distance
	 * @return {boolean}
	 * @protected
	 */
	hasReachedMinimumDistance_(distanceX, distanceY) {
		this.distanceDragged_ += Math.abs(distanceX) + Math.abs(distanceY);
		return this.distanceDragged_ >= this.minimumDragDistance;
	}

	/**
	 * Checks if one of the sources are being dragged.
	 * @return {boolean}
	 */
	isDragging() {
		return this.dragging_;
	}

	/**
	 * Validates the `source` attribute.
	 * @param {*} source
	 * @return {boolean}
	 * @protected
	 */
	validatorSourceFn_(source) {
		return core.isString(source) || core.isElement(source);
	}
}

/**
 * Attributes definition.
 * @type {!Object}
 * @static
 */
Drag.ATTRS = {
	/**
	 * The minimum distance, in pixels, that the mouse needs to move before
	 * the action is considered a drag.
	 * @type {number}
	 * @default 5
	 */
	minimumDragDistance: {
		validator: core.isNumber,
		value: 5,
		writeOnce: true
	},

	/**
	 * Elements that should be draggable. Can be either a single element
	 * or a selector for multiple elements.
	 * @type {!Element|string}
	 */
	source: {
		validator: 'validatorSourceFn_'
	}
};

/**
 * Constant that holds the names of events that can be emitted by `Drag`.
 * @type {!Object}
 * @static
 */
Drag.Events = {
	DRAG: 'drag',
	END: 'end'
};

export default Drag;
