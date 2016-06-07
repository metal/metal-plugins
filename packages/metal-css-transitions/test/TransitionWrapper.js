'use strict';
import JSXComponent from 'metal-jsx';

import TransitionWrapper from '../src/TransitionWrapper';

describe('TransitionWrapper', function() {
	let component;

	afterEach(
		() => {
			if (component) {
				component.dispose();
			}
		}
	);

	it(
		'renders',
		() => {
			const component = new TransitionWrapper();

			assert(component);
		}
	);

	it(
		'renders with children',
		() => {
			class App extends JSXComponent {
				render() {
					return (
						<TransitionWrapper
						appearTimeout={1000}
						enterTimeout={1000}
						leaveTimeout={1000}
						name="test"
						>
							<div class="child" key={1}>Child</div>
						</TransitionWrapper>
						);
				}
			}

			const component = new App();

			assert(component.element.querySelector('.child'));
		}
	);
});
