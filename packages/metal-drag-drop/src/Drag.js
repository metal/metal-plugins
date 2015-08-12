'use strict';

import core from 'bower:metal/src/core';
import dom from 'bower:metal/src/dom/dom';
import Attribute from 'bower:metal/src/attribute/Attribute';
import DragScrollDelta from './helpers/DragScrollDelta';
import DragShim from './helpers/DragShim';
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
		 * The drag placeholder that is active at the moment.
		 * @type {Element}
		 * @protected
		 */
		this.activeDragPlaceholder_ = null;

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
		 * `DragScrollDelta` instance.
		 * @type {!DragScrollDelta}
		 * @protected
		 */
		this.dragScrollDelta_ = new DragScrollDelta();

		/**
		 * The `EventHandler` instance that holds events for the source (or sources).
		 * @type {!EventHandler}
		 * @protected
		 */
		this.sourceHandler_ = new EventHandler();

		this.attachSourceEvents_();
		this.on('sourcesChanged', this.handleSourcesChanged_.bind(this));
		this.dragScrollDelta_.on('scrollDelta', this.handleScrollDelta_.bind(this));
	}

	/**
	 * Attaches the necessary events to the source (or sources).
	 * @protected
	 */
	attachSourceEvents_() {
		var listenerFn = this.handleDragStartEvent_.bind(this);
		this.sourceHandler_.add(
			dom.on(this.sources, 'mousedown', listenerFn),
			dom.on(this.sources, 'touchstart', listenerFn)
		);
	}

	/**
	 * Checks if the given event can start a drag operation.
	 * @param {!Event} event
	 * @return {boolean}
	 * @protected
	 */
	canStartDrag_(event) {
		return !this.disabled &&
			(!core.isDef(event.button) || event.button === 0) &&
			!this.isDragging() &&
			this.isWithinHandle_(event.target);
	}

	/**
	 * Resets all variables to their initial values and detaches drag listeners.
	 * @protected
	 */
	cleanUpAfterDragging_() {
		if (this.activeDragPlaceholder_) {
			dom.removeClasses(this.activeDragPlaceholder_, this.draggingClass);
			if (this.dragPlaceholder === Drag.Placeholder.CLONE) {
				dom.exitDocument(this.activeDragPlaceholder_);
			}
		}
		this.activeDragPlaceholder_ = null;
		this.activeDragSource_ = null;
		this.currentSourceX_ = null;
		this.currentSourceY_ = null;
		this.currentMouseX_ = null;
		this.currentMouseY_ = null;
		this.dragging_ = false;
		this.dragHandler_.removeAllListeners();
	}

	/**
	 * Clones the active drag source and adds the clone to the document.
	 * @return {!Element}
	 * @protected
	 */
	cloneActiveDrag_() {
		var placeholder = this.activeDragSource_.cloneNode(true);
		placeholder.style.position = 'absolute';
		dom.append(this.activeDragSource_.parentNode, placeholder);
		return placeholder;
	}

	/**
	 * Creates the active drag placeholder, unless it already exists.
	 * @protected
	 */
	createActiveDragPlaceholder_() {
		var dragPlaceholder = this.dragPlaceholder;
		if (dragPlaceholder === Drag.Placeholder.CLONE) {
			this.activeDragPlaceholder_ = this.cloneActiveDrag_();
		} else if (core.isElement(dragPlaceholder)) {
			this.activeDragPlaceholder_ = dragPlaceholder;
		} else {
			this.activeDragPlaceholder_ = this.activeDragSource_;
		}
	}

	/**
	 * @inheritDoc
	 */
	disposeInternal() {
		this.cleanUpAfterDragging_();
		this.dragHandler_ = null;
		this.dragScrollDelta_.dispose();
		this.dragScrollDelta_ = null;
		this.sourceHandler_.removeAllListeners();
		this.sourceHandler_ = null;
		super.disposeInternal();
	}

	/**
	 * Emits the given event with the current drag data.
	 * @param {string} eventType
	 * @protected
	 */
	emitDragEvent_(eventType) {
		this.emit(eventType, {
			placeholder: this.activeDragPlaceholder_,
			source: this.activeDragSource_,
			x: this.currentSourceX_,
			y: this.currentSourceY_
		});
	}

	/**
	 * Gets the active drag source.
	 * @return {Element}
	 */
	getActiveDrag() {
		return this.activeDragSource_;
	}

	/**
	 * Handles events that can end a drag action, like "mouseup" and "touchend".
	 * Triggered when the mouse drag action ends.
	 * @protected
	 */
	handleDragEndEvent_() {
		this.dragScrollDelta_.stop();
		DragShim.hideDocShim();
		if (this.moveOnEnd) {
			this.updatePosition_(this.activeDragSource_);
		}
		this.emitDragEvent_(Drag.Events.END);
		this.cleanUpAfterDragging_();
	}

	/**
	 * Handles events that can move a draggable element, like "mousemove" and "touchmove".
	 * Tracks the movement on the screen to update the drag action.
	 * @param {!Event} event
	 * @protected
	 */
	handleDragMoveEvent_(event) {
		var position = event.targetTouches ? event.targetTouches[0] : event;
		var distanceX = position.clientX - this.currentMouseX_;
		var distanceY = position.clientY - this.currentMouseY_;
		this.currentMouseX_ = position.clientX;
		this.currentMouseY_ = position.clientY;
		if (!this.isDragging() && !this.hasReachedMinimumDistance_(distanceX, distanceY)) {
			return;
		}

		if (!this.isDragging()) {
			this.dragging_ = true;
			this.createActiveDragPlaceholder_();
			dom.addClasses(this.activeDragPlaceholder_, this.draggingClass);
			this.dragScrollDelta_.start(this.activeDragPlaceholder_, this.scrollContainers);
		}

		this.currentSourceX_ += distanceX;
		this.currentSourceY_ += distanceY;
		if (this.move) {
			this.updatePosition_(this.activeDragPlaceholder_);
		}
		this.emitDragEvent_(Drag.Events.DRAG);
	}

	/**
	 * Handles events that can start a drag action, like "mousedown" and "touchstart".
	 * When this is triggered and the sources were not already being dragged, more
	 * listeners will be attached to keep track of the drag action.
	 * @param {!Event} event
	 * @protected
	 */
	handleDragStartEvent_(event) {
		this.activeDragSource_ = event.delegateTarget || event.currentTarget;

		if (this.canStartDrag_(event)) {
			this.dragHandler_.add.apply(
				this.dragHandler_,
				DragShim.attachDocListeners(this.useShim, {
					mousemove: this.handleDragMoveEvent_.bind(this),
					touchmove: this.handleDragMoveEvent_.bind(this),
					mouseup: this.handleDragEndEvent_.bind(this),
					touchend: this.handleDragEndEvent_.bind(this)
				})
			);

			var position = event.targetTouches ? event.targetTouches[0] : event;
			this.currentMouseX_ = position.clientX;
			this.currentMouseY_ = position.clientY;
			this.currentSourceX_ = this.activeDragSource_.offsetLeft;
			this.currentSourceY_ = this.activeDragSource_.offsetTop;
			this.distanceDragged_ = 0;

			event.preventDefault();
		}
	}

	/**
	 * Handles a "scrollDelta" event. Updates the position data for the source,
	 * as well as the placeholder's position on the screen when "move" is set to true.
	 * @param {!Object} event [description]
	 * @protected
	 */
	handleScrollDelta_(event) {
		this.currentSourceX_ += event.deltaX;
		this.currentSourceY_ += event.deltaY;
		if (this.move) {
			this.updatePosition_(this.activeDragPlaceholder_);
		}
		this.emitDragEvent_(Drag.Events.DRAG);
	}

	/**
	 * Triggers when the `sources` attribute changes. Detaches events attached to the
	 * previous sources and attaches them to the new value instead.
	 * @protected
	 */
	handleSourcesChanged_() {
		this.sourceHandler_.removeAllListeners();
		this.attachSourceEvents_();
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
	 * Checks if the given element is within a valid handle.
	 * @param {!Element} element
	 * @protected
	 */
	isWithinHandle_(element) {
		var handles = this.handles;
		if (!handles) {
			return true;
		} else if (core.isString(handles)) {
			return dom.match(element, handles + ', ' + handles + ' *');
		} else {
			return handles.contains(element);
		}
	}

	/**
	 * Sets the `scrollContainers` attribute.
	 * @param {Element|string} scrollContainers
	 * @return {!Array<!Element>}
	 * @protected
	 */
	setterScrollContainersFn_(scrollContainers) {
		var elements = [document];
		if (core.isString(scrollContainers)) {
			var matched = document.querySelectorAll(scrollContainers);
			elements = elements.concat(Array.prototype.slice.call(matched, 0));
		} else if (scrollContainers && scrollContainers !== document) {
			elements.push(scrollContainers);
		}
		return elements;
	}

	/**
	 * Updates the position of the element with the current source coordinates.
	 * @param {!Element} element
	 * @protected
	 */
	updatePosition_(element) {
		element.style.left = this.currentSourceX_ + 'px';
		element.style.top = this.currentSourceY_ + 'px';
	}

	/**
	 * Validates the given value, making sure that it's either an element or a string.
	 * @param {*} val
	 * @return {boolean}
	 * @protected
	 */
	validateElementOrString_(val) {
		return core.isString(val) || core.isElement(val);
	}
}

/**
 * Attributes definition.
 * @type {!Object}
 * @static
 */
Drag.ATTRS = {
	/**
	 * Flag indicating if drag operations are disabled. When set to true, it
	 * dragging won't work.
	 * @type {boolean}
	 * @default false
	 */
	disabled: {
		validator: core.isBoolean,
		value: false
	},

	/**
	 * The CSS class that should be added to the node being dragged.
	 * @type {string}
	 * @default 'dragging'
	 */
	draggingClass: {
		validator: core.isString,
		value: 'dragging'
	},

	/**
	 * The placeholder element that should be moved during drag. Can be either
	 * an element or the "clone" string, indicating that a clone of the source
	 * being dragged should be used. If nothing is set, the original source element
	 * will be used.
	 * @type {Element|?string}
	 */
	dragPlaceholder: {
		validator: 'validateElementOrString_'
	},

	/**
	 * Elements inside the source that should be the drag handles. Can be
	 * either a single element or a selector for multiple elements.
	 * @type {Element|?string}
	 */
	handles: {
		validator: 'validateElementOrString_'
	},

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
	 * Flag indicating if the dragged element should be moved automatically,
	 * following the mouse cursor during the drag action.
	 * @type {boolean}
	 * @default true
	 */
	move: {
		value: true
	},

	/**
	 * Flag indicating if the source element should be moved automatically
	 * to the final position on drag end. This is important when `dragPlaceholder`
	 * is set, since during the drag that will be element that will move instead
	 * of the original source.
	 * @type {boolean}
	 * @default true
	 */
	moveOnEnd: {
		value: true
	},

	/**
	 * Elements with scroll, besides the document, that contain any of the given
	 * sources. Can be either a single element or a selector for multiple elements.
	 * @type {Element|string}
	 */
	scrollContainers: {
		setter: 'setterScrollContainersFn_',
		validator: 'validateElementOrString_'
	},

	/**
	 * Elements that should be draggable. Can be either a single element
	 * or a selector for multiple elements.
	 * @type {!Element|string}
	 */
	sources: {
		validator: 'validateElementOrString_'
	},

	/**
	 * Flag indicating if a shim should be used for capturing document events.
	 * This is important for allowing dragging nodes over iframes. If false,
	 * events will be listened in the document itself instead.
	 * @type {boolean}
	 * @default true
	 */
	useShim: {
		value: true
	}
};

/**
 * Holds the names of events that can be emitted by `Drag`.
 * @type {!Object}
 * @static
 */
Drag.Events = {
	DRAG: 'drag',
	END: 'end'
};

/**
 * Holds the values that can be passed to the `dragPlaceholder` attribute.
 * @type {!Object}
 * @static
 */
Drag.Placeholder = {
	CLONE: 'clone'
};

export default Drag;
