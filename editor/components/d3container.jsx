import React, { Component } from 'react';

class D3Container extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return JSON.stringify(nextProps) !== JSON.stringify(this.props);
	}

	renderP5 = (id, args) => {
		const sketch = require(`../sketchfiles/${id}`).default(200, 200, id, args);
		return <P5Wrapper sketch={sketch} state={this.props.state} />;
	};

	render() {
		return (
			<div id={this.props.id} style={{ width: '100%', height: '100%' }}>
				<svg id="d3" width="200" height="200"></svg>
			</div>
		);
	}
}

export default D3Container;
