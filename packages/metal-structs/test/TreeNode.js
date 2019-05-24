'use strict';

import TreeNode from '../src/TreeNode';

describe('TreeNode', function() {
	it('should create node with not defined value', function() {
		const tree = new TreeNode();
		assert.strictEqual(undefined, tree.getValue());
	});

	it('should create node with null value', function() {
		const tree = new TreeNode(null);
		assert.strictEqual(null, tree.getValue());
	});

	it('should create node with value', function() {
		const tree = new TreeNode(1);
		assert.strictEqual(1, tree.getValue());
	});

	it('should create node with empty children array', function() {
		const tree = new TreeNode();
		assert.ok(Array.isArray(tree.getChildren()));
	});

	it('should add child to node', function() {
		const tree = new TreeNode();
		const child = new TreeNode();
		tree.addChild(child);
		assert.strictEqual(1, tree.getChildCount());
	});

	it('should remove child from node', function() {
		const tree = new TreeNode();
		const child = new TreeNode();
		tree.addChild(child);
		assert.strictEqual(1, tree.getChildCount());
		assert.strictEqual(child, tree.removeChild(child));
		assert.strictEqual(null, tree.removeChild(undefined));
		assert.strictEqual(0, tree.getChildCount());
	});

	it('should not add child to node if child already has a parent', function() {
		const tree0 = new TreeNode();
		const tree1 = new TreeNode();
		const child = new TreeNode();
		tree0.addChild(child);
		assert.throws(function() {
			tree1.addChild(child);
		}, Error);
	});

	it('should get child at certain position on node', function() {
		const tree = new TreeNode();
		const child0 = new TreeNode();
		const child1 = new TreeNode();
		tree.addChild(child0);
		tree.addChild(child1);
		assert.strictEqual(2, tree.getChildCount());
		assert.strictEqual(child0, tree.getChildAt(0));
		assert.strictEqual(child1, tree.getChildAt(1));
	});

	it('should get child at inexistent position as null', function() {
		const tree = new TreeNode();
		const child = new TreeNode();
		tree.addChild(child);
		assert.strictEqual(1, tree.getChildCount());
		assert.strictEqual(child, tree.getChildAt(0));
		assert.strictEqual(null, tree.getChildAt(1));
	});

	it('should get node depth', function() {
		const tree = new TreeNode();
		const child00 = new TreeNode();
		const child01 = new TreeNode();
		tree.addChild(child00);
		child00.addChild(child01);
		assert.strictEqual(0, tree.getDepth());
		assert.strictEqual(1, child00.getDepth());
		assert.strictEqual(2, child01.getDepth());
	});

	it('should get node ancestors', function() {
		const tree = new TreeNode();
		const child00 = new TreeNode();
		const child01 = new TreeNode();
		tree.addChild(child00);
		child00.addChild(child01);
		assert.deepEqual([], tree.getAncestors());
		assert.deepEqual([tree], child00.getAncestors());
		assert.deepEqual([child00, tree], child01.getAncestors());
	});

	it('should test hether this node is the ancestor of the given node', function() {
		const tree = new TreeNode();
		const child00 = new TreeNode();
		const child01 = new TreeNode();
		tree.addChild(child00);
		child00.addChild(child01);
		assert.ok(!tree.contains(tree));
		assert.ok(tree.contains(child00));
		assert.ok(tree.contains(child01));
		assert.ok(!child00.contains(child00));
		assert.ok(child00.contains(child01));
		assert.ok(!child01.contains(child01));
	});

	it('should get the root node as the node itself if there is no parent', function() {
		const tree = new TreeNode();
		assert.strictEqual(tree, tree.getRoot());
	});

	it('should get the root node', function() {
		const tree = new TreeNode();
		const child00 = new TreeNode();
		const child01 = new TreeNode();
		tree.addChild(child00);
		child00.addChild(child01);
		assert.strictEqual(tree, tree.getRoot());
		assert.strictEqual(tree, child00.getRoot());
		assert.strictEqual(tree, child01.getRoot());
	});

	it('should test if the node is leaf', function() {
		const tree = new TreeNode();
		const child00 = new TreeNode();
		const child01 = new TreeNode();
		tree.addChild(child00);
		child00.addChild(child01);
		assert.ok(!tree.isLeaf());
		assert.ok(!child00.isLeaf());
		assert.ok(child01.isLeaf());
	});

	it('should traverse depth-first in pre-order', function() {
		const A = new TreeNode('A');
		const B = new TreeNode('B');
		const C = new TreeNode('C');
		const D = new TreeNode('D');
		const E = new TreeNode('E');
		const F = new TreeNode('F');
		A.addChild(B);
		A.addChild(C);
		B.addChild(D);
		C.addChild(E);
		C.addChild(F);
		const path = [];
		A.traverse(node => path.push(node.getValue()));
		assert.deepEqual(['A', 'B', 'D', 'C', 'E', 'F'], path);
	});

	it('should traverse depth-first in post-order', function() {
		const A = new TreeNode('A');
		const B = new TreeNode('B');
		const C = new TreeNode('C');
		const D = new TreeNode('D');
		const E = new TreeNode('E');
		const F = new TreeNode('F');
		A.addChild(B);
		A.addChild(C);
		B.addChild(D);
		C.addChild(E);
		C.addChild(F);
		const path = [];
		A.traverse(null, node => path.push(node.getValue()));
		assert.deepEqual(['D', 'B', 'E', 'F', 'C', 'A'], path);
	});
});
