'use strict';

import JSXComponent from 'metal-jsx';

import TransitionWrapper from '../src/TransitionWrapper';

class App extends JSXComponent {
	created() {
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.index += 2;
	}

	getChildren() {
		const {index} = this;

		return [
			<div class="child" key={index}>child {index}</div>,
			<div class="child" key={index + 1}>child {index + 1}</div>,
		];
	}

	render() {
		return (
			<span>
				<button data-onclick={this.onClick}>ClickMe</button>

				<TransitionWrapper name="test" appearTimeout={500} enterTimeout={500} leaveTimeout={500}>
					{
						this.getChildren()
					}
				</TransitionWrapper>
			</span>
		);
	}
}

App.STATE = {
	index: {
		value: 1
	}
}

export default App;