import React, { Component } from 'react';
import Head from 'next/head';
import P5Container from '../p5container';

class Index extends Component {
	static async getInitialProps(ctx) {
		const sketchId = ctx.query.id;
		return {
			sketchId,
		};
	}

	render() {
		return (
			<>
				<Head>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Art</title>
				</Head>
				<div style={{ background: '#515151' }}>
					<h1>{this.props.sketchId}</h1>
					<div style={{ width: '100%', height: '80vh' }}>
						<P5Container id={this.props.sketchId} />
					</div>

					<br />
				</div>
			</>
		);
	}
}

export default Index;
