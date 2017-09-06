'use strict';

import { array, core, object } from 'metal';
import dom from 'metal-dom';
import Drag from './Drag';
import Position from 'metal-position';
import 'metal-events';

/**
 * Adds the functionality of dropping dragged elements to specific
 * targets to the `Drag` class.
 * @extends {Drag}
 */
class DragDrop extends Drag {
	/**
	 * @inheritDoc
	 */
	constructor(opt_config) {
		super(opt_config);

		/**
		 * The currently active targets, that is, the ones that the dragged source is over.
		 * @type {!Array<!Element>}
		 * @protected
		 */
		this.activeTargets_ = [];
	}

	/**
	 * Adds a target to this `DragDrop` instance.
	 * @param {!Element} target
	 */
	addTarget(target) {
		this.targets.push(target);
		this.targets = this.targets;
	}

	/**
	 * Overrides the original method from `Drag` to include the target on the event object.
	 * @return {!Object}
	 * @protected
	 * @override
	 */
	buildEventObject_() {
		var obj = super.buildEventObject_();
		obj.target = this.activeTargets_[0];
		obj.allActiveTargets = this.activeTargets_;
		return obj;
	}

	/**
	 * @inheritDoc
	 */
	cleanUpAfterDragging_() {
		super.cleanUpAfterDragging_();
		this.targets.forEach(target => target.removeAttribute('aria-dropeffect'));
		if (this.activeTargets_.length) {
			dom.removeClasses(this.activeTargets_[0], this.targetOverClass);
		}
		this.activeTargets_ = [];
	}

	/**
	 * Finds all targets that the dragged element is currently over.
	 * @return {!Array<!Element>} The current active targets.
	 * @protected
	 */
	findAllActiveTargets_() {
		var activeTargets = [];
		var mainRegion;
		var sourceRegion = this.getSourceRegion_();
		var targets = this.targets;
		targets.forEach(function(target, index) {
			var region = Position.getRegion(target);
			if (targets[index] !== this.activeDragPlaceholder_ && Position.intersectRegion(region, sourceRegion)) {
				if (!mainRegion || Position.insideRegion(mainRegion, region)) {
					activeTargets = [targets[index]].concat(activeTargets);
					mainRegion = region;
				} else {
					activeTargets.push(targets[index]);
				}
			}
		}.bind(this));
		return activeTargets;
	}

	/**
	 * Gets the active source's region, to be used when calculating which targets are active.
	 * @return {!Object}
	 * @protected
	 */
	getSourceRegion_() {
		if (core.isDefAndNotNull(this.mousePos_)) {
			var x = this.mousePos_.x;
			var y = this.mousePos_.y;
			return Position.makeRegion(y, 0, x, x, y, 0);
		} else {
			// We need to remove the scroll data from the region, since the other regions we'll
			// be comparing to won't take that information into account.
			var region = object.mixin({}, this.sourceRegion_);
			region.left -= document.body.scrollLeft;
			region.right -= document.body.scrollLeft;
			region.top -= document.body.scrollTop;
			region.bottom -= document.body.scrollTop;
			return region;
		}
	}

	/**
	 * Triggers when the `container` state changes. Overrides default method so
	 * it will also update `targets` when container changes.
	 * @param {!Object} data
	 * @param {!Object} event
	 * @protected
	 */
	handleContainerChanged_(data, event) {
		super.handleContainerChanged_(data, event);
		if (this.prevTargetsSelector_) {
			this.targets = this.prevTargetsSelector_;
		}
	}

	/**
	 * Removes a target from this `DragDrop` instance.
	 * @param {!Element} target
	 */
	removeTarget(target) {
		array.remove(this.targets, target);
		this.targets = this.targets;
	}

	/**
	 * Sets the `targets` state property.
	 * @param {Element|string} val
	 * @return {!Array<!Element>}
	 * @protected
	 */
	setterTargetsFn_(val) {
		this.prevTargetsSelector_ = core.isString(val) ? val : null;
		return this.toElements_(val);
	}

	/**
	 * Overrides the original method from `Drag` to also set the "aria-dropeffect"
	 * attribute, if set, for all targets.
	 * @return {[type]} [description]
	 */
	startDragging_() {
		if (this.ariaDropEffect) {
			this.targets.forEach(target => target.setAttribute('aria-dropeffect', this.ariaDropEffect));
		}
		super.startDragging_();
	}

	/**
	 * Overrides original method from `Drag` to also be enable finding the target
	 * the dragged element is over at the new position.
	 * @param {number} deltaX
	 * @param {number} deltaY
	 * @override
	 */
	updatePosition(deltaX, deltaY) {
		super.updatePosition(deltaX, deltaY);

		var newTargets = this.findAllActiveTargets_();
		if (newTargets[0] !== this.activeTargets_[0]) {
			if (this.activeTargets_[0]) {
				dom.removeClasses(this.activeTargets_[0], this.targetOverClass);
				this.emit(DragDrop.Events.TARGET_LEAVE, this.buildEventObject_());
			}

			this.activeTargets_ = newTargets;
			if (this.activeTargets_[0]) {
				dom.addClasses(this.activeTargets_[0], this.targetOverClass);
				this.emit(DragDrop.Events.TARGET_ENTER, this.buildEventObject_());
			}
		}
	}
}

/**
 * State definition.
 * @type {!Object}
 * @static
 */
DragDrop.STATE = {
	/**
	 * The "aria-dropeffect" value to be set for all targets. If not set,
	 * this html attribute will have to be set manually on the targets.
	 * @type {string}
	 */
	ariaDropEffect: {
		validator: core.isString
	},

	/**
	 * The CSS class that should be added to drop targets when a source
	 * is being dragged over them.
	 * @type {string}
	 * @default 'dropOver'
	 */
	targetOverClass: {
		validator: core.isString,
		value: 'targetOver'
	},

	/**
	 * Elements that the sources can be dropped on. Can be either a single
	 * element or a selector for multiple elements.
	 * @type {!Element|string}
	 */
	targets: {
		setter: 'setterTargetsFn_',
		validator: 'validateElementOrString_'
	}
};

/**
 * Holds the names of events that can be emitted by `DragDrop`.
 * @type {!Object}
 * @static
 */
DragDrop.Events = {
	DRAG: 'drag',
	END: 'end',
	TARGET_ENTER: 'targetEnter',
	TARGET_LEAVE: 'targetLeave'
};

export { DragDrop, Drag };
export default DragDrop;
