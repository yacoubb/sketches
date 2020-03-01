import React, { Component } from 'react';
import Layout from '../../components/layout';
import Head from 'next/head';
import P5Container from '../../components/p5container';
import css from '../../components/main.scss';

import sketchIndex from '../../../sketch-index.json';

class P5Page extends Component {
	constructor(props) {
		super(props);
		this.state = {
			density: 0.48,
			seed: '',
			w: 10,
			args: { runTime: new Date().valueOf(), density: 0.48, seed: '', w: 10 },
		};

		this.updateArgs = this.updateArgs.bind(this);
	}

	updateArgs() {
		this.setState({
			args: {
				runTime: new Date().valueOf(),
				density: this.state.density,
				seed: this.state.seed,
				w: this.state.w,
			},
		});
	}

	render() {
		const sketchInfo = sketchIndex['caves'];
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
						<h1>{sketchInfo['title']}</h1>
						<div>
							{sketchInfo['description'].map((val, idx) => (
								<p key={idx}>{val}</p>
							))}
						</div>
						<div className="row">
							<div className="col-lg" style={{ height: '70vmin' }}>
								<P5Container id={sketchInfo['id']} args={this.state.args} />
							</div>
							<div className="col-lg-2">
								{`Density: ${this.state.density}`}
								<input
									type="range"
									className="custom-range"
									min={0}
									max={1}
									value={this.state.density}
									step={0.01}
									id="densitySlider"
									onChange={e => {
										this.setState({ density: e.target.value });
									}}
								/>

								{`Scale: ${this.state.w}`}
								<input
									type="range"
									className="custom-range"
									min={4}
									max={20}
									value={this.state.w}
									step={1}
									id="densitySlider"
									onChange={e => {
										this.setState({ w: e.target.value });
									}}
								/>

								<input
									type="text"
									className="form-control"
									id="seedInput"
									// aria-describedby="emailHelp"
									placeholder="Enter seed"
									onChange={e => {
										this.setState({ seed: e.target.value });
									}}
									style={{ margin: '1em 0 1em 0' }}
								/>
								<button
									className="btn btn-primary btn-block"
									onClick={this.updateArgs}
								>
									Generate
								</button>
							</div>
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
