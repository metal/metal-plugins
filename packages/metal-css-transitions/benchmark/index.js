'use strict';

import Component, {Config} from 'metal-jsx';
import Transition from '../src/TransitionWrapper';

let a = 0;

function arrayGenerator(length) {
	return Array.apply(null, {length: length}).map(Number.call, Number);
}

class App extends Component {
	created() {
		this.onClick_ = this.onClick_.bind(this);
	}

	onClick_() {
		this.state.multiplier += 1;
	}

	shouldUpdate() {
		a = performance.now();

		return true;
	}

	rendered() {
		console.log('Time(ms): ', performance.now() - a);
	}

	render() {
		return (
			<span>
				<button onClick={this.onClick_}>{'Click Me'}</button>

				<Transition name="test">
					{arrayGenerator(5000).map((item, index) =>
						<div class="child" key={`top${index}`}>child {index}</div>
					)}

					{arrayGenerator(5000).map((item, index) =>
						<div class="child" key={index}>
							child {index * this.state.multiplier}
						</div>
					)}
				</Transition>
			</span>
		);
	}
}

App.STATE = {
	multiplier: Config.value(1)
};

window.ExampleApp = App;
