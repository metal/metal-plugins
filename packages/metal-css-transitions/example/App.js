'use strict';

import Component, {Config} from 'metal-jsx';

import Transition from '../src/TransitionWrapper';

class App extends Component {
	created() {
		this.onClick_ = this.onClick_.bind(this);
	}

	onClick_() {
		this.state.index += 2;
	}

	getChildren_() {
		const {index} = this.state;

		return [
			<div class="child" key={index}>child {index}</div>,
			<div class="child" key={index + 1}>child {index + 1}</div>,
		];
	}

	render() {
		return (
			<span>
				<button data-onclick={this.onClick_}>ClickMe</button>

				<Transition name="test">
					{
						this.getChildren_()
					}
				</Transition>
			</span>
		);
	}
}

App.STATE = {
	index: Config.value(1)
};

export default App;