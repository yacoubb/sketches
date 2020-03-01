import React, { Component } from 'react';
import Layout from '../../components/layout';
import Head from 'next/head';
import P5Container from '../../components/p5container';
import css from '../../components/main.scss';

import sketchIndex from '../../sketches/sketch-index.json.js';

class P5Page extends Component {
	static async getInitialProps(ctx) {
		const sketchId = ctx.query.id;
		const sketchInfo = sketchIndex[sketchId];
		return {
			sketchId,
			sketchInfo,
		};
	}

	render() {
		return (
			<>
				<Head>
					<meta charSet="utf-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0"
					/>
					<title>Art</title>
				</Head>
				<Layout>
					<div className="container" style={{ paddingTop: '2em' }}>
						<h1>{this.props.sketchInfo['title']}</h1>
						<div>
							{this.props.sketchInfo['description'].map((val, idx) => (
								<p key={idx}>{val}</p>
							))}
						</div>
						<div style={{ width: '100%', height: '70vh' }}>
							<P5Container {...this.props.sketchInfo} />
						</div>

						<br />
						<p style={{ fontSize: '12px', color: `${css.linkHover}` }}>
							Interactive pages work best on desktop!
						</p>
					</div>
				</Layout>
			</>
		);
	}
}

export default P5Page;
