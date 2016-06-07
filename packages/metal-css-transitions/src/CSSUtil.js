'use strict';

const REGEX_EMPTY = /[\n\t\r]/g;
const SPACE = ' ';

const normalize = function(classes) {
	return (SPACE + classes + SPACE).replace(REGEX_EMPTY, SPACE);
};

const util = {
	addClass(node, className) {
		node.className += SPACE + className.trim();

		node.className = node.className.trim();
	},

	removeClass(node, className) {
		const nodeClasses = node.className.trim();
		let classes = normalize(nodeClasses);

		className = className.trim();
		className = SPACE + className + SPACE;

		while (classes.indexOf(className) >= 0) {
			classes = classes.replace(className, SPACE);
		}

		node.className = classes.trim();
	}
};

export default util;