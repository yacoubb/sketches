import React, { Component } from 'react';
import dynamic from 'next/dynamic';

const P5Wrapper = dynamic(import('react-p5-wrapper'), {
	loading: () => <p>Loading...</p>,
	ssr: false,
});

class P5Container extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sketch: require(`../sketchfiles/${props.id}`).default,
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return JSON.stringify(nextProps) !== JSON.stringify(this.props);
	}

	render() {
		console.log(this.state.sketch);
		return (
			<div id={this.props.id} style={{ width: '100%', height: '100%' }}>
				<P5Wrapper sketch={this.state.sketch(200, 200, this.props.id, this.props.args)} state={this.props.state} />
			</div>
		);
	}
}

export default P5Container;
