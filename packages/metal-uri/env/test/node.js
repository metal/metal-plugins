'use strict';

import assert from 'assert';
import Uri from '../../src/Uri';
import url from 'url';

Uri.setParseFn(url.parse);

global.assert = assert;
