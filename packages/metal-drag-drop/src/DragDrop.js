'use strict';

import dom from 'bower:metal/src/dom/dom';
import core from 'bower:metal/src/core';
import Drag from './Drag';
import Position from 'bower:metal-position/src/Position';
import 'bower:metal/src/dom/events';

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

		/**
		 * The calculated positions for each target. This will only be set when needed for the
		 * first time.
		 * @type {Array}
		 * @protected
		 */
		this.targetRegions_ = null;
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
		if (this.activeTargets_.length) {
			dom.removeClasses(this.activeTargets_[0], this.targetOverClass);
		}
		this.activeTargets_ = [];
		this.targetRegions_ = null;
	}

	/**
	 * Finds all targets that the dragged element is currently over.
	 * @return {!Array<!Element>} The current active targets.
	 * @protected
	 */
	findAllActiveTargets_() {
		var activeTargets = [];
		var mainRegion;
		var x = this.currentMouseX_;
		var y = this.currentMouseY_;
		var targets = this.targets;
		this.getTargetRegions_().forEach(function(region, index) {
			if (targets[index] !== this.activeDragSource_ && Position.pointInsideRegion(x, y, region)) {
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
	 * Gets the calculated regions for each target, calculating them if they have not
	 * yet been set.
	 * @return {!Array<!Object>}
	 * @protected
	 */
	getTargetRegions_() {
		if (!this.targetRegions_) {
			this.targetRegions_ = this.targets.map(target => Position.getRegion(target));
		}
		return this.targetRegions_;
	}

	/**
	 * Overrides original method from `Drag` to also be enable finding the target
	 * the dragged element is over at the new position.
	 * @param {number} deltaX
	 * @param {number} deltaY
	 * @protected
	 * @override
	 */
	updatePosition_(deltaX, deltaY) {
		super.updatePosition_(deltaX, deltaY);

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
 * Attributes definition.
 * @type {!Object}
 * @static
 */
DragDrop.ATTRS = {
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
		setter: 'toElements_',
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

export default DragDrop;
