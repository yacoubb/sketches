import React, { Component } from 'react';
import dynamic from 'next/dynamic';

const P5Wrapper = dynamic(import('react-p5-wrapper'), {
	loading: () => <p>Loading...</p>,
	ssr: false,
});

class P5Container extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return JSON.stringify(nextProps) !== JSON.stringify(this.props);
	}

	renderP5 = (id, args) => {
		console.log(this.state.height);
		const sketch = require(`../sketches/interactive/${id}/${id}`).default(
			200,
			200,
			id,
			args,
		);
		return <P5Wrapper sketch={sketch} state={this.props.state} />;
	};

	render() {
		return (
			<div id={this.props.id} style={{ width: '100%', height: '100%' }}>
				{this.renderP5(this.props.id, this.props.args)}
			</div>
		);
	}
}

export default P5Container;
