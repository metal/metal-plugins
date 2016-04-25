'use strict';

import { array } from 'metal';

/**
 * Generic tree node data structure with arbitrary number of child nodes.
 * @param {V} value Value.
 * @constructor
 */
class TreeNode {

	constructor(value) {
		/**
		 * The value.
		 * @private {V}
		 */
		this.value_ = value;

		/**
		 * Reference to the parent node or null if it has no parent.
		 * @private {TreeNode}
		 */
		this.parent_ = null;

		/**
		 * Child nodes or null in case of leaf node.
		 * @private {Array<!TreeNode>}
		 */
		this.children_ = null;
	}

	/**
	 * Appends a child node to this node.
	 * @param {!TreeNode} child Orphan child node.
	 */
	addChild(child) {
		assertChildHasNoParent(child);
		child.setParent(this);
		this.children_ = this.children_ || [];
		this.children_.push(child);
	}

	/**
	 * Tells whether this node is the ancestor of the given node.
	 * @param {!TreeNode} node A node.
	 * @return {boolean} Whether this node is the ancestor of {@code node}.
	 */
	contains(node) {
		let current = node.getParent();
		while (current) {
			if (current === this) {
				return true;
			}
			current = current.getParent();
		}
		return false;
	}

	/**
	 * @return {!Array<TreeNode>} All ancestor nodes in bottom-up order.
	 */
	getAncestors() {
		let ancestors = [];
		let node = this.getParent();
		while (node) {
			ancestors.push(node);
			node = node.getParent();
		}
		return ancestors;
	}

	/**
	 * Gets the child node of this node at the given index.
	 * @param {number} index Child index.
	 * @return {?TreeNode} The node at the given index
	 * or null if not found.
	 */
	getChildAt(index) {
		return this.getChildren()[index] || null;
	}

	/**
	 * @return {?Array<!TreeNode>} Child nodes or null in case of leaf node.
	 */
	getChildren() {
		return this.children_ || TreeNode.EMPTY_ARRAY;
	}

	/**
	 * @return {number} The number of children.
	 */
	getChildCount() {
		return this.getChildren().length;
	}

	/**
	 * @return {number} The number of ancestors of the node.
	 */
	getDepth() {
		let depth = 0;
		let node = this;
		while (node.getParent()) {
			depth++;
			node = node.getParent();
		}
		return depth;
	}

	/**
	 * @return {?TreeNode} Parent node or null if it has no parent.
	 */
	getParent() {
		return this.parent_;
	}

	/**
	 * @return {!TreeNode} The root of the tree structure, i.e. the farthest
	 * ancestor of the node or the node itself if it has no parents.
	 */
	getRoot() {
		let root = this;
		while (root.getParent()) {
			root = root.getParent();
		}
		return root;
	}

	/**
	 * Gets the value.
	 * @return {V} The value.
	 */
	getValue() {
		return this.value_;
	}

	/**
	 * @return {boolean} Whether the node is a leaf node.
	 */
	isLeaf() {
		return !this.getChildCount();
	}

	/**
	 * Removes the given child node of this node.
	 * @param {TreeNode} child The node to remove.
	 * @return {TreeNode} The removed node if any, null otherwise.
	 */
	removeChild(child) {
		if (array.remove(this.getChildren(), child)) {
			return child;
		}
		return null;
	}

	/**
	 * Sets the parent node of this node. The callers must ensure that the
	 * parent node and only that has this node among its children.
	 * @param {TreeNode} parent The parent to set. If null, the node will be
	 * detached from the tree.
	 * @protected
	 */
	setParent(parent) {
		this.parent_ = parent;
	}

}

/**
 * Constant for empty array to avoid unnecessary allocations.
 * @private
 */
TreeNode.EMPTY_ARRAY = [];

/**
 * Asserts that child has no parent.
 * @param {TreeNode} child A child.
 * @private
 */
const assertChildHasNoParent = function(child) {
	if (child.getParent()) {
		throw new Error('Cannot add child with parent.');
	}
};

export default TreeNode;
