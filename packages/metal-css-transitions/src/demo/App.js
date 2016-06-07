'use strict';

import JSXComponent from 'metal-jsx';

import TransitionWrapper from '../TransitionWrapper';

class App extends JSXComponent {
	created() {
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.index += 2;
	}

	getChildren() {
		return [
			<div class="child" key={1}>child 1</div>,
			<div class="child" key={2}>child 2</div>,
			<div class="child" key={3}>child 3</div>,
			<div class="child" key={4}>child 4</div>,
			<div class="child" key={5}>child 5</div>,
			<div class="child" key={6}>child 6</div>,
			<div class="child" key={7}>child 7</div>,
			<div class="child" key={8}>child 8</div>,
			<div class="child" key={9}>child 9</div>,
			<div class="child" key={10}>child 10</div>
		].slice(this.index, this.index + 2)
	}

	render() {
		return (
			<span>
				<button data-onclick={this.onClick}>ClickMe</button>

					<TransitionWrapper name="test" appearTimeout={1000} enterTimeout={1000} leaveTimeout={1000}>
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
		value: 0
	}
}

export default App;