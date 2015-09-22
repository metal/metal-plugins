'use strict';

import ComponentRegistry from 'bower:metal/src/component/ComponentRegistry';
import SoyComponent from 'bower:metal/src/soy/SoyComponent';
import './Clipboard.soy';

class Clipboard extends SoyComponent {
	constructor(opt_config) {
		super(opt_config);
	}
}

Clipboard.ELEMENT_CLASSES = 'clipboard';

ComponentRegistry.register('Clipboard', Clipboard);

export default Clipboard;
